import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  console.warn("⚠️  DATABASE_URL not set - database features will be disabled");
  console.warn(
    "   Connect to Neon to enable full functionality: https://console.neon.tech",
  );
}

export { pool };

// Test database connection
export const testConnection = async (): Promise<void> => {
  if (!pool) {
    console.log("⚠️  Database not configured - skipping connection test");
    return;
  }

  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL database connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL database connection failed:", error);
    console.error("   Consider connecting to Neon for database functionality");
    throw error;
  }
};

// Initialize database tables
export const initializeTables = async (): Promise<void> => {
  if (!pool) {
    console.log("⚠️  Database not configured - skipping table initialization");
    return;
  }

  try {
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'INR',
        status VARCHAR(20) NOT NULL DEFAULT 'created',
        razorpay_order_id VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trigger for updated_at column on orders table
    await pool.query(`
      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS set_timestamp ON orders;
      CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON orders
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
    `);

    // Create payment_transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        razorpay_payment_id VARCHAR(50),
        razorpay_signature VARCHAR(255),
        user_id VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    // Create trigger for updated_at column on payment_transactions table
    await pool.query(`
      DROP TRIGGER IF EXISTS set_timestamp ON payment_transactions;
      CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON payment_transactions
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
    `);

    console.log("✅ Database tables initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database tables:", error);
    throw error;
  }
};

// Database operations interfaces
export interface Order {
  id?: number;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id: string;
  snippet_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentTransaction {
  id?: number;
  order_id: number;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  user_id: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

// Helper functions for database operations
export const createOrder = async (
  orderData: Omit<Order, "id" | "created_at" | "updated_at">,
): Promise<number> => {
  if (!pool) throw new Error("Database not configured");
  const result = await pool.query(
    "INSERT INTO orders (amount, currency, status, razorpay_order_id, snippet_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [
      orderData.amount,
      orderData.currency,
      orderData.status,
      orderData.razorpay_order_id,
      orderData.snippet_id,
    ],
  );
  return result.rows[0].id;
};

export const updateOrderStatus = async (
  razorpayOrderId: string,
  status: string,
): Promise<void> => {
  if (!pool) throw new Error("Database not configured");
  await pool.query(
    "UPDATE orders SET status = $1 WHERE razorpay_order_id = $2",
    [status, razorpayOrderId],
  );
};

export const createPaymentTransaction = async (
  transactionData: Omit<PaymentTransaction, "id" | "created_at" | "updated_at">,
): Promise<number> => {
  if (!pool) throw new Error("Database not configured");
  const result = await pool.query(
    "INSERT INTO payment_transactions (order_id, razorpay_payment_id, razorpay_signature, user_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [
      transactionData.order_id,
      transactionData.razorpay_payment_id,
      transactionData.razorpay_signature,
      transactionData.user_id,
      transactionData.status,
    ],
  );
  return result.rows[0].id;
};

export const updatePaymentTransactionStatus = async (
  orderId: number,
  status: string,
  paymentId?: string,
  signature?: string,
): Promise<void> => {
  if (!pool) throw new Error("Database not configured");
  if (paymentId && signature) {
    await pool.query(
      "UPDATE payment_transactions SET status = $1, razorpay_payment_id = $2, razorpay_signature = $3 WHERE order_id = $4",
      [status, paymentId, signature, orderId],
    );
  } else {
    await pool.query(
      "UPDATE payment_transactions SET status = $1 WHERE order_id = $2",
      [status, orderId],
    );
  }
};

export const getOrderByRazorpayId = async (
  razorpayOrderId: string,
): Promise<Order | null> => {
  if (!pool) throw new Error("Database not configured");
  const result = await pool.query(
    "SELECT * FROM orders WHERE razorpay_order_id = $1",
    [razorpayOrderId],
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getPaymentTransactionByOrderId = async (
  orderId: number,
): Promise<PaymentTransaction | null> => {
  if (!pool) throw new Error("Database not configured");
  const result = await pool.query(
    "SELECT * FROM payment_transactions WHERE order_id = $1",
    [orderId],
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

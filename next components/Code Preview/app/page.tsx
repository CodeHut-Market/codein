import { FooterComprehensive } from "@/components/footer-comprehensive"
import { ProductPage } from "@/components/product-page"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductPage />
      <FooterComprehensive />
    </div>
  )
}

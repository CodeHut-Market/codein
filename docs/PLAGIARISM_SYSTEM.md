# CodeHut Plagiarism Detection AI System

## System Architecture

### Overview

A comprehensive multi-layer AI system that automatically detects code plagiarism in real-time during uploads, providing intelligent scoring and moderation capabilities.

### Core Components

#### 1. Detection Pipeline (Multi-Layer)

- **Layer 1: Exact & Near Duplicate Detection**
  - Hash-based fingerprinting (MD5, SHA-256)
  - Shingle-based similarity (n-grams)
  - Fuzzy string matching with edit distance
- **Layer 2: Structural Code Analysis**
  - Abstract Syntax Tree (AST) parsing
  - Control flow graph comparison
  - Variable/function name normalization
- **Layer 3: Semantic Understanding**
  - Code embeddings using CodeBERT/GraphCodeBERT
  - Algorithmic pattern recognition
  - Functional similarity detection

#### 2. Scoring Engine

- **Combined Scoring**: Weighted average of all layers
- **Thresholds**:
  - ≥0.85 = BLOCK (High plagiarism)
  - 0.65-0.85 = REVIEW (Suspicious)
  - <0.65 = PASS (Clean)

#### 3. Decision Engine

- Real-time classification
- Automated blocking/approval
- Queue suspicious items for human review

#### 4. Reference Corpus

- Indexed database of all approved code
- External code repositories (GitHub, StackOverflow)
- License and attribution tracking

#### 5. Moderation Interface

- Visual heatmaps of plagiarized sections
- Source attribution and licensing guidance
- Batch review capabilities
- Appeals and override system

### Data Flow

```
Upload → Preprocessing → Multi-Layer Detection → Scoring → Decision → Storage/Review
```

### Database Schema

#### Tables:

- `plagiarism_scans` - Detection results
- `code_fingerprints` - Hash indices
- `ast_signatures` - Structural patterns
- `semantic_embeddings` - Code embeddings
- `reference_corpus` - Indexed code database
- `moderation_queue` - Items needing review
- `plagiarism_reports` - Detailed analysis results

### Performance Requirements

- **Latency**: <5 seconds for typical code snippet
- **Throughput**: 1000+ uploads/minute
- **Storage**: Efficient indexing for millions of snippets
- **Accuracy**: >95% precision, >90% recall

### Scalability Strategy

- Microservices architecture
- Horizontal scaling of detection workers
- Distributed storage and indexing
- Caching layer for frequent comparisons

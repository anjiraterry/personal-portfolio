export const NOTES_CONTENT: Record<string, string> = {
  "semantic-caching-llms": `
    <p class="text-xl text-white/70 leading-relaxed mb-8">
      LLM latency and costs are the two biggest hurdles to production AI applications. Semantic caching offers a way to bypass the model entirely for redundant queries.
    </p>
    
    <h2 class="text-2xl font-display font-bold text-white mb-4 mt-12">The Problem with Exact Matching</h2>
    <p class="mb-6 text-white/60">
      Traditional caching (like Redis key-value) relies on exact string matching. In natural language, "How do I reset my password?" and "I forgot my password, how to reset?" are semantically identical but string-distinct.
    </p>

    <div class="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-8">
      <h3 class="text-[rgb(0,167,157)] font-bold text-sm uppercase tracking-widest mb-3">Key Concept</h3>
      <p class="text-white/80 text-base italic">
        "Semantic caching uses vector embeddings to calculate the distance between a new query and previous cached queries."
      </p>
    </div>

    <h2 class="text-2xl font-display font-bold text-white mb-4 mt-12">The Architecture</h2>
    <p class="mb-6 text-white/60">
      A robust semantic cache consists of three layers:
    </p>
    <ul class="list-disc pl-6 space-y-3 mb-8 text-white/70">
      <li><strong>Embedding Layer:</strong> Convert incoming query to a vector.</li>
      <li><strong>Vector Index:</strong> Perform a similarity search (top-k) against cached vectors.</li>
      <li><strong>Threshold Logic:</strong> Only return the cache if cosine similarity is &gt; 0.95 (or your chosen threshold).</li>
    </ul>

    <h2 class="text-2xl font-display font-bold text-white mb-4 mt-12">Results and Tradeoffs</h2>
    <p class="mb-6 text-white/60">
      In our latest implementation, we saw a 40% reduction in API costs and a sub-50ms response time for 25% of all traffic. However, you must handle "hallucinated" cache hits where a similar-looking query requires a fresh answer.
    </p>
  `,
  "multi-agent-production": `
    <p class="text-xl text-white/70 leading-relaxed mb-8">
      Multi-agent systems are the current frontier of AI applications. But shipping them to production is a nightmare of orchestration, reliability, and cost control.
    </p>
    <h2 class="text-2xl font-display font-bold text-white mb-4 mt-12">The Postmortem</h2>
    <p class="mb-6 text-white/60">
      We shipped an agentic system for automated document analysis. In staging, with 10 documents, it was perfect. In production, with 10,000 documents, it entered infinite loops and burned $500 in 10 minutes.
    </p>
    <p class="mb-6 text-white/60">
      Lessons learned: never give an agent a blank check. Always implement max turn limits, human-in-the-loop for destructive actions, and strict budget monitoring per session.
    </p>
  `,
  "rag-chunking-deep-dive": `
    <p class="text-xl text-white/70 leading-relaxed mb-8">
      RAG is only as good as the context you provide. Most people use naive fixed-size chunking. Most people are getting suboptimal results.
    </p>
    <h2 class="text-2xl font-display font-bold text-white mb-4 mt-12">The Experiment</h2>
    <p class="mb-6 text-white/60">
      We tested 7 different chunking strategies across a corpus of complex legal and technical documents.
    </p>
    <p class="mb-6 text-white/60">
      The winner? <strong>Semantic Chunking</strong>. By identifying concept boundaries using an LLM to "look ahead", we achieved a 20% higher retrieval precision than fixed 512-token chunks.
    </p>
  `,
};

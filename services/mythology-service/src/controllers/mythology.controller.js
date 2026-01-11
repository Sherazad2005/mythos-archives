const axios = require("axios");

const LORE = process.env.LORE_SERVICE_URL || "http://localhost:4001";

function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-zàâçéèêëîïôûùüÿñæœ\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set([
  "je","tu","il","elle","nous","vous","ils","elles","on",
  "un","une","des","du","de","d","la","le","les","au","aux",
  "et","ou","mais","donc","or","ni","car",
  "a","à","dans","sur","sous","avec","sans","pour","par","en",
  "ce","cet","cette","ces","mon","ma","mes","ton","ta","tes",
  "son","sa","ses","leur","leurs",
  "qui","que","quoi","dont","où",
  "est","suis","es","sommes","êtes","sont",
  "ai","as","a","avons","avez","ont",
  "vu","voir","près","tres","très"
]);

function topKeywordsFromTestimonies(testimonies, limit = 10) {
  const counts = new Map();
  for (const t of testimonies) {
    const words = normalizeText(t.description).split(" ");
    for (const w of words) {
      if (!w || w.length < 4) continue;
      if (STOP.has(w)) continue;
      counts.set(w, (counts.get(w) || 0) + 1);
    }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, limit).map(([word, count]) => ({ word, count }));
}

async function getStats(req, res, next) {
  try {
    const [creaturesResp, testimoniesResp] = await Promise.all([
      axios.get(`${LORE}/creatures`, { timeout: 8000 }),
      axios.get(`${LORE}/testimonies`, { timeout: 8000 }),
    ]);

    const creatures = creaturesResp.data || [];
    const testimonies = testimoniesResp.data || [];

   
    const occMap = new Map(); 
    for (const t of testimonies) {
      const id = String(t.creatureId);
      occMap.set(id, (occMap.get(id) || 0) + 1);
    }

    const occurrencesByCreature = [...occMap.entries()]
      .map(([creatureId, count]) => ({ creatureId, count }))
      .sort((a, b) => b.count - a.count);

    const top = occurrencesByCreature.slice(0, Number(req.query.top || 5));

 
    const totalCreatures = creatures.length;
    const totalTestimonies = testimonies.length;
    const averageTestimoniesPerCreature = totalCreatures === 0 ? 0 : totalTestimonies / totalCreatures;

  
    const statusDistribution = { PENDING: 0, VALIDATED: 0, REJECTED: 0 };
    for (const t of testimonies) {
      if (t.status && statusDistribution[t.status] !== undefined) statusDistribution[t.status] += 1;
    }


    const families = {};
    for (const c of creatures) {
      const family = c.mythology || "Unknown";
      if (!families[family]) families[family] = [];
      families[family].push({
        id: c._id,
        name: c.name,
        description: c.description,
      });
    }


    const keywords = topKeywordsFromTestimonies(testimonies, Number(req.query.keywords || 10));

    return res.json({
      totals: { totalCreatures, totalTestimonies },
      occurrencesByCreature,
      topCreaturesByTestimonies: top,
      averageTestimoniesPerCreature,
      statusDistribution,
      keywords,
      classification: {
        families,
        note: "Classification simple basée sur le champ mythology des créatures.",
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getStats };

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GARDEN_FACTS = [
  "🌱 Soil pH controls nutrient availability; fertilizer can be present but unavailable when pH is far outside a crop's preferred range.",
  "🌱 Most vegetables prefer slightly acidic to neutral soil, roughly pH 6.0 to 7.0, while blueberries prefer much more acidic soil.",
  "🌱 Blueberries usually fail in alkaline soil unless pH is adjusted before planting, because changing established beds is slow.",
  "🌱 Soil pH amendments work gradually; fall applications often give lime or sulfur time to react before spring planting.",
  "🌱 A good soil test is a composite sample from several spots, not one scoop from the prettiest corner of the bed.",
  "🌱 Soil samples should come from a consistent depth; vegetable beds are commonly sampled deeper than lawns.",
  "🌱 Compost improves sandy soils by helping them hold water and nutrients.",
  "🌱 Compost improves heavy clay by supporting aggregation, air movement, and drainage.",
  "🌱 Compost feeds soil organisms first; plant nutrients are released gradually as biology breaks it down.",
  "🌱 Finished compost should smell earthy and crumble easily, not smell sour or rotten.",
  "🌱 Manure-based compost can be salty or alkaline, which matters for seedlings and acid-loving plants.",
  "🌱 Mulch reduces evaporation from the soil surface and helps keep root-zone moisture steadier.",
  "🌱 Organic mulch slowly becomes organic matter, improving soil structure as it decomposes.",
  "🌱 A 2- to 4-inch mulch layer is often enough for weed suppression without smothering soil air exchange.",
  "🌱 Keep mulch away from woody stems; mulch piled against trunks can invite rot and pests.",
  "🌱 Straw mulch keeps strawberries and cucurbits cleaner by reducing soil splash during rain.",
  "🌱 No-dig gardening protects worm channels, fungal networks, and natural soil structure.",
  "🌱 No-dig beds are usually fed from the top with compost, letting soil organisms incorporate organic matter.",
  "🌱 Digging can bring buried weed seed to the surface, which is one reason no-dig beds often weed more easily.",
  "🌱 Cover crops protect bare soil, feed soil life, and can add biomass between vegetable crops.",
  "🌱 Legume cover crops can add nitrogen when they are managed as green manures.",
  "🌱 Raised beds warm earlier in spring than in-ground soil, which can extend cool-season planting windows.",
  "🌱 A soil and compost blend is usually better for raised beds than filling them with pure compost.",
  "🌱 Raised beds drain quickly, so they often need more careful irrigation than in-ground clay soils.",
  "🌱 Clay soil holds water well but absorbs it slowly; deep, patient watering beats short blasts.",
  "🌱 Sandy soil drains quickly and may need more frequent watering and more organic matter.",
  "🌱 The finger test still works: if soil is dry a couple inches down near roots, it is time to water.",
  "🌱 Drip and soaker systems water roots while keeping leaves drier, which can reduce foliar disease pressure.",
  "🌱 In arid gardens, ollas deliver water through porous clay directly into the root zone with little surface evaporation.",
  "🌱 Desert gardens benefit from basins and berms that catch rainfall and irrigation near each plant.",
  "🌱 In hot regions, mulch is also root-zone shade; cooler soil can matter as much as extra water.",
  "🌱 Prairie plants often grow deep root systems, so too much fertilizer can make them floppy rather than stronger.",
  "🌱 Native plant gardens work best when they include blooms across spring, summer, and fall.",
  "🌱 Pollinator plantings are stronger in clumps than as scattered single plants, because insects find them more easily.",
  "🌱 Many native bees nest in bare soil, so leaving a few unmulched patches can support pollinators.",
  "🌱 Leaving some hollow stems through winter can preserve overwintering pollinator larvae.",
  "🌱 Milkweed is not just nectar for monarchs; it is the required host plant for monarch caterpillars.",
  "🌱 Dill, fennel, and parsley can host black swallowtail caterpillars, so chewed foliage can be a success sign.",
  "🌱 Intercropping lettuce or radishes between slower crops uses space before the larger crop shades them out.",
  "🌱 Deep-rooted crops and shallow-rooted crops can share space more efficiently than plants with identical root habits.",
  "🌱 Succession planting replaces finished cool-season crops with warm-season crops, turning one bed into several harvests.",
  "🌱 Crop rotation helps break pest and disease cycles, especially in small vegetable gardens.",
  "🌱 Tomatoes, peppers, eggplants, and potatoes are all nightshades, so rotating among them is not a true family rotation.",
  "🌱 Pinching basil above a leaf pair encourages branching and delays flowering.",
  "🌱 Garlic is often planted in fall in cold-winter regions so cloves root before winter and size up in spring.",
  "🌱 Many Mediterranean herbs prefer lean, sharply drained soil; rich wet soil can reduce aroma and survival.",
  "🌱 Hydrangea flower color can shift with soil chemistry because aluminum availability changes with pH.",
  "🌱 Potatoes tolerate more acidic soil than many vegetables and are often grown around pH 5.0 to 5.5.",
  "🌱 Fresh wood chips are useful on paths and perennial beds, but mixing large amounts into soil can tie up nitrogen temporarily.",
  "🌱 Grass clippings make good mulch only in thin layers; thick mats can block air and water.",
  "🌱 Compost piles need air, moisture, and nitrogen; wet compacted piles slow down and can smell anaerobic.",
  "🌱 Avoid composting diseased plants, pet waste, meat, grease, and dairy in ordinary home garden compost systems.",
  "🌱 In humid climates, wider spacing can improve airflow and reduce leaf disease pressure.",
  "🌱 In dry climates, closer spacing and living mulches can shade soil, but irrigation must still reach roots.",
  "🌱 Regional gardening starts with climate: rainfall patterns, heat, wind, and soil parent material change the best technique.",
];

interface GardenFactsProps {
  lastActivity: number;
}

export const GardenFacts: React.FC<GardenFactsProps> = ({ lastActivity }) => {
  const [showFact, setShowFact] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const checkIdle = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      if (idleTime > 15000 && !showFact) {
        // User has been idle for 15 seconds
        setCurrentFact(Math.floor(Math.random() * GARDEN_FACTS.length));
        setShowFact(true);
        setFadeOut(false);
      } else if (idleTime < 3000 && showFact) {
        // User is active again, hide fact
        setFadeOut(true);
        setTimeout(() => setShowFact(false), 500);
      }
    }, 1000);

    return () => clearInterval(checkIdle);
  }, [lastActivity, showFact]);

  if (!showFact) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'absolute',
            bottom: 'max(80px, 10%)',
            left: 0,
            right: 0,
            margin: '0 auto',
            maxWidth: '90vw',
            width: 'min(400px, 90vw)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(241,248,233,0.95) 100%)',
            borderRadius: 20,
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(27, 94, 32, 0.15)',
            zIndex: 100,
            border: '2px solid rgba(129, 199, 132, 0.4)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            style={{
              fontSize: 14,
              color: '#1B5E20',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            {GARDEN_FACTS[currentFact]}
          </motion.div>
          <motion.div
            style={{
              fontSize: 11,
              color: '#66BB6A',
              marginTop: 8,
              fontWeight: 600,
              opacity: 0.7,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌿 Tap anywhere to continue playing
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GardenFacts;

import { campaign } from './imagery';

export type JourneyImage = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
};

export type JourneyChapter = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: JourneyImage;
  imagePosition: string;
  backgroundImage?: JourneyImage;
  ctaLabel?: string;
  ctaHref?: string;
};

const image = (name: string, alt: string): JourneyImage => ({
  src: `/images/craft-journey/${name}-1440.webp`,
  srcSet: `/images/craft-journey/${name}-720.webp 720w, /images/craft-journey/${name}-1440.webp 1440w`,
  width: 1440,
  height: 960,
  alt,
});

export const craftJourneyBackground: JourneyImage = campaign.DRE3aGHDKCw;

export const craftJourneyChapters: readonly JourneyChapter[] = [
  {
    id: 'design', number: '01', title: 'Design',
    description: 'A piece begins with an idea and a conversation. Proportion, personality and the way a jewel will be worn become the starting points for a design that feels personal.',
    image: image('design', 'Illustrative jewellery design consultation with a ring sketch and gemstone tray'),
    imagePosition: '50% 50%',
  },
  {
    id: 'materials', number: '02', title: 'Materials',
    description: 'Colour, light and character shape the choices to come. Gemstones and precious metals are considered together, finding a balance between the natural beauty of a stone and the design around it.',
    image: image('materials', 'Illustrative close-up of an emerald being examined above a gemstone tray'),
    imagePosition: '50% 50%',
  },
  {
    id: 'sketch', number: '03', title: 'Sketch',
    description: 'Pencil meets paper. Lines explore the setting, the silhouette and the space around each stone, turning a feeling into a design that can be shaped by hand.',
    image: image('sketch', 'Illustrative workshop scene of an emerald ring taking shape in a pencil sketch'),
    imagePosition: '50% 52%',
  },
  {
    id: 'mould', number: '04', title: 'Mould',
    description: 'The drawing takes on dimension. A wax model gives form to the proportions and fine details, creating a pattern from which the metal setting can take shape.',
    image: image('mould', 'Illustrative workshop scene of a jeweller carving a wax ring model'),
    imagePosition: '50% 50%',
  },
  {
    id: 'cast', number: '05', title: 'Cast',
    description: 'The model gives way to metal. Casting captures the structure of the design in gold, ready for the careful refining and assembly that follow.',
    image: image('cast', 'Illustrative close-up of a newly cast gold ring mounting beside its casting mould'),
    imagePosition: '50% 50%',
  },
  {
    id: 'weld', number: '06', title: 'Weld',
    description: 'Separate elements are brought together with precisely controlled heat. Each connection is carefully finished, giving the piece its strength, continuity and final silhouette.',
    image: image('weld', 'Illustrative workshop scene of a jeweller joining a gold ring mounting with controlled heat'),
    imagePosition: '50% 52%',
  },
  {
    id: 'set', number: '07', title: 'Set',
    description: 'Each stone finds its place. The setting is worked around the gemstone with small, deliberate adjustments, holding it securely while allowing its colour and light to come through.',
    image: image('setting', 'Illustrative workshop scene of a jeweller setting an emerald into a gold ring'),
    imagePosition: '50% 52%',
  },
  {
    id: 'polish', number: '08', title: 'Polish',
    description: 'The final touch reveals the details. Careful polishing brings depth and lustre to the gold, completing the journey from a first idea to a jewel ready to be worn.',
    image: image('polish-wheel', 'Illustrative workshop scene of a gold emerald ring being finished at a polishing wheel'),
    imagePosition: '50% 50%',
    ctaLabel: 'Begin your story', ctaHref: '/contact/',
  },
];

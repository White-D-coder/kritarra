import { campaign, type CampaignPhoto } from './imagery';

type EditorialPanelBase = {
  id: string;
  offsetY: number;
  depth: number;
};

export type EditorialSlide = EditorialPanelBase & (
  | { kind: 'image'; photo: CampaignPhoto; caption: string }
  | { kind: 'text'; label: string; passages: { text: string; italic?: boolean }[] }
);

export const signatureEditorialSlides: EditorialSlide[] = [
  {
    id: 'the-creation', kind: 'image', offsetY: 0, depth: 4,
    photo: campaign.DNCz7r3vGng,
    caption: '01 / A personal perspective',
  },
  {
    id: 'the-feeling', kind: 'text', offsetY: 50, depth: 3,
    label: '02 / The feeling',
    passages: [
      { text: 'Some creations are not simply worn. ' },
      { text: 'They become a part of who we are.', italic: true },
    ],
  },
  {
    id: 'the-detail', kind: 'image', offsetY: 100, depth: 2,
    photo: campaign.DRE3aGHDKCw,
    caption: '03 / A study in detail',
  },
  {
    id: 'the-expression', kind: 'text', offsetY: 150, depth: 1,
    label: '04 / The expression',
    passages: [
      { text: 'An expression of artistry, shaped by thoughtful design and an enduring appreciation for ' },
      { text: 'beauty.', italic: true },
    ],
  },
];

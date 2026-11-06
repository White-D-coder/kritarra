import { ArrowUpRight } from "lucide-react";
import { Asset, Reveal, Perspective } from "@/components/editorial";
import { CuratedSelection } from "@/components/curated-selection";
import { instagram } from "@/lib/catalog";
import { Hero } from "@/components/hero";
import { Discovery } from "@/components/discovery";
import { VisualJournal } from "@/components/visual-journal";
import { Remembered } from "@/components/remembered";
import { BrandIntro } from "@/components/brand-intro";
import { BrandStatement } from "@/components/brand-statement";
import { CraftStory } from "@/components/craft-story";
import { KritarraEditorialSlider } from "@/components/KritarraEditorialSlider";
import { signatureEditorialSlides } from "@/lib/signature-editorial";
import { socialCampaigns } from "@/lib/imagery";
export default function Home() {
  return (
    <main id="main" className="home-main">
      <BrandIntro />
      <Hero />
      {/* <BrandStatement/> */}
      <KritarraEditorialSlider slides={signatureEditorialSlides} />
      <Discovery />
      <Perspective />
      <CuratedSelection />
      <CraftStory />
      <VisualJournal />
      <Remembered />
      <section className="social-section section">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">The world, through our lens</span>
            <h2>
              Keep a little <em>closer.</em>
            </h2>
          </div>
          <a
            className="text-link"
            href={instagram}
            target="_blank"
            rel="noreferrer"
          >
            Follow on Instagram <ArrowUpRight size={14} />
          </a>
        </Reveal>
        <div className="social-grid">
          {socialCampaigns.map((photo) => (
            <a
              href={photo.source}
              target="_blank"
              rel="noreferrer"
              key={photo.id}
              aria-label={`View ${photo.alt} on Kritarra’s Instagram`}
            >
              <Asset photo={photo} sizes="(max-width: 600px) 50vw, 25vw" />
              <span className="social-hover">
                View on Instagram <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
        {/* <div className="social-bottom">
          <span>Selected moments from @kritarraofficial.</span>
          <a
            className="text-link"
            href={instagram}
            target="_blank"
            rel="noreferrer"
          >
            Follow on Instagram <ArrowUpRight size={14} />
          </a>
        </div> */}
      </section>
    </main>
  );
}

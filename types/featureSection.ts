export interface FeatureSlide {
  /** Unique identifier for the slide */
  id: string;
  /** Type of content to render (used to pick the right component) */
  type: 'calendar' | 'time' | 'chart';
  /** Title shown in the step indicator */
  title: string;
  /** Optional descriptive text or markdown for the slide */
  description?: string;
}

export interface FeatureSectionData {
  /** Unique identifier for the section */
  id?: string;
  /** Main heading for this feature section */
  title: string;
  /** Subheading or subtitle */
  subtitle: string;
  /** List of slides (and step titles) to display in the carousel */
  slides: FeatureSlide[];
}

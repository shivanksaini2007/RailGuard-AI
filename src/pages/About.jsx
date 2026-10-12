import React from 'react';
import {
  Activity, Camera, BarChart3, MapPinned,
  ShieldCheck, TrainFront, UsersRound, Zap,
} from 'lucide-react';

import PageHeader from '../components/PageHeader';
import FeatureCard from '../components/FeatureCard';
import SectionTitle from '../components/SectionTitle';

const features = [
  {
    icon: Camera,
    title: 'AI camera monitoring',
    description: 'Use a browser camera to detect visible objects with the demo computer-vision model.',
    number: '01',
  },
  {
    icon: ShieldCheck,
    title: 'Safety incident workflow',
    description: 'Turn detections and manual tests into incidents that can be reviewed and acknowledged.',
    number: '02',
  },
  {
    icon: MapPinned,
    title: 'Railway zone overview',
    description: 'View a sample track layout and its camera, train and safety status markers.',
    number: '03',
  },
  {
    icon: BarChart3,
    title: 'Reports and insights',
    description: 'Review stored demo incidents and export a CSV report for your presentation.',
    number: '04',
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About RailGuard AI"
        subtitle="A student-built railway safety prototype, designed for a clear and practical demo."
      />

      <section className="about-hero panel">
        <div className="about-hero-icon"><TrainFront size={28} /></div>
        <span className="section-eyebrow">THE IDEA</span>
        <h2>Safer tracks start with better awareness.</h2>
        <p>
          RailGuard AI brings camera-based object detection, incident tracking and a simple
          operations dashboard into one React application. It helps demonstrate how a railway
          team could review potential hazards from a single place.
        </p>
        <div className="about-flow">
          <span><Camera size={15} /> Camera</span>
          <i>→</i>
          <span><Activity size={15} /> Detection</span>
          <i>→</i>
          <span><ShieldCheck size={15} /> Alert</span>
          <i>→</i>
          <span><Zap size={15} /> Review</span>
        </div>
      </section>

      <SectionTitle
        eyebrow="What is included"
        title="Built around a simple workflow"
        description="Small reusable parts keep the interface consistent and easy to maintain."
      />

      <div className="feature-grid">
        {features.map((feature) => (
          <FeatureCard key={feature.number} {...feature} />
        ))}
      </div>

      <SectionTitle
        eyebrow="Made by students"
        title="The team"
        description="Created as a learning and hackathon project using React and modern frontend tools."
      />

      <div className="team-grid">
        <article className="team-card panel">
          <div className="team-avatar">SS</div>
          <div>
            <h3>Shivank Saini</h3>
            <p>Frontend development · React UI</p>
          </div>
          <UsersRound size={19} />
        </article>
        <article className="team-card panel">
          <div className="team-avatar secondary">S</div>
          <div>
            <h3>Shubham</h3>
            <p>Project team · Collaboration</p>
          </div>
          <UsersRound size={19} />
        </article>
      </div>

      <div className="production-note about-disclaimer">
        <ShieldCheck size={20} />
        <div>
          <strong>Prototype only</strong>
          <span>
            This application is for college and hackathon demonstrations. It is not railway-certified
            and must not be used for real train control, signaling or emergency decisions.
          </span>
        </div>
      </div>
    </>
  );
}

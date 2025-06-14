import React from 'react';
import { Demo, createStep } from '../src';

// Simple button component
const SimpleButton = ({ 
  id, 
  children 
}: { 
  id: string, 
  children: React.ReactNode
}) => (
  <button
    id={id}
    style={{ 
      backgroundColor: '#4A00E0',
      color: 'white',
      padding: '10px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease-in-out'
    }}
  >
    {children}
  </button>
);

const ComprehensiveDemo: React.FC = () => {
  const steps = [
    createStep({
      name: 'Introduction',
      content: (
        <div className="demo-step">
          <h1>Welcome to demo.js</h1>
          <p>A simple library for creating interactive demos</p>
        </div>
      ),
      duration: 3000,
      fadeIn: true,
      fadeInDuration: 500,
    }),
    
    createStep({
      name: 'Features',
      content: (
        <div className="demo-step">
          <h2>Key Features</h2>
          <ul>
            {['Step-by-step demos', 'Cursor animations', 'Scrolling capabilities', 'Simple transitions'].map((feature, index) => (
              <li 
                key={index} 
                id={`feature-${index + 1}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {feature}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px' }}>
            <SimpleButton id="learn-more-btn">
              Learn More
            </SimpleButton>
          </div>
        </div>
      ),
      duration: 14000,
      cursor: [
        {
          type: 'click',
          target: '#feature-1',
          delay: 1000,
        },
        {
          type: 'click',
          target: '#feature-2',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#feature-3',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#feature-4',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#learn-more-btn',
          delay: 2000,
        }
      ],
      fadeIn: true,
      fadeInDuration: 1000,
      customEasing: (t: number) => {
        return 1 - Math.pow(1 - t, 3);
      }
    }),
    
    createStep({
      name: 'Interactive Elements',
      content: (
        <div className="demo-step">
          <h2>Interactive Elements</h2>
          <p>The cursor can interact with various UI components</p>
          
          <div style={{ marginTop: '30px' }}>
            <h3>Radio Buttons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label>
                <input 
                  type="radio" 
                  id="option-1" 
                  name="demo-option" 
                  value="option1" 
                />
                <span style={{ marginLeft: '8px' }}>Option 1</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  id="option-2" 
                  name="demo-option" 
                  value="option2" 
                />
                <span style={{ marginLeft: '8px' }}>Option 2</span>
              </label>
              <label>
                <input 
                  type="radio" 
                  id="option-3" 
                  name="demo-option" 
                  value="option3"
                />
                <span style={{ marginLeft: '8px' }}>Option 3</span>
              </label>
            </div>
            
            <h3>Checkboxes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label>
                <input 
                  type="checkbox" 
                  id="checkbox-1"
                />
                <span style={{ marginLeft: '8px' }}>Feature 1</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  id="checkbox-2"
                />
                <span style={{ marginLeft: '8px' }}>Feature 2</span>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  id="checkbox-3"
                />
                <span style={{ marginLeft: '8px' }}>Feature 3</span>
              </label>
            </div>
            
            <h3>Slider</h3>
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="range" 
                id="slider-input"
                min="0" 
                max="100" 
                defaultValue="50"
                style={{ width: '100%' }}
              />
              <div id="slider-value" style={{ textAlign: 'center', marginTop: '8px' }}>
                Value: 50
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 15000,
      cursor: [
        {
          type: 'click',
          target: '#option-1',
          delay: 1000,
        },
        {
          type: 'click',
          target: '#option-2',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#option-3',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#checkbox-1',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#checkbox-2',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#checkbox-3',
          delay: 1500,
        },
        {
          type: 'click',
          target: '#slider-input',
          delay: 1500,
        }
      ],
      fadeIn: true,
      fadeInDuration: 1000,
    }),
    
    createStep({
      name: 'Scrolling Demo',
      content: (
        <div className="demo-step" style={{ minHeight: '1500px' }}>
          <h2>Scrolling Demonstration</h2>
          <p>This shows how scrolling works in demo.js</p>
          
          <div style={{ height: '300px', margin: '30px 0', background: '#f5f7fa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h3>Scroll Down</h3>
              <p>↓</p>
            </div>
          </div>
          
          <div style={{ marginTop: '600px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 id="scrolled-content">
                You've arrived!
              </h3>
              <p>
                This is the end of the scrolling section.
              </p>
            </div>
          </div>
        </div>
      ),
      duration: 5000,
      scroll: {
        type: 'down',
        amount: '60%',
        speed: 400,
        delay: 1000,
        target: '#scrolled-content',
      },
      fadeIn: true,
    }),
    
    createStep({
      name: 'Conclusion',
      content: (
        <div className="demo-step">
          <h2>Ready to Create Demos?</h2>
          <p>With demo.js, you can build interactive product tours and tutorials.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
            <SimpleButton id="docs-btn">
              Read the Docs
            </SimpleButton>
            <button 
              id="github-btn"
              style={{ 
                backgroundColor: '#24292e',
                color: 'white', 
                padding: '10px 16px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              View on GitHub
            </button>
          </div>
        </div>
      ),
      duration: 5000,
      cursor: [
        {
          type: 'click',
          target: '#docs-btn',
          delay: 1000,
        },
        {
          type: 'click',
          target: '#github-btn',
          delay: 2000,
        }
      ],
      fadeIn: true,
    }),
  ];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <Demo
        steps={steps}
        autoPlay={true}
        loop={false}
        onStepComplete={(stepId) => console.log(`Step completed: ${stepId}`)}
        onComplete={() => console.log('Demo completed')}
      />
    </div>
  );
};

export default ComprehensiveDemo; 
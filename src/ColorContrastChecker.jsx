import React, { useState } from 'react';
import ColorPicker from 'react-color'; // You'll need to install this: npm install react-color

function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [contrastRatio, setContrastRatio] = useState(0);
  const [complianceLevel, setComplianceLevel] = useState('');

  const handleForegroundChange = (color) => {
    setForeground(color.hex);
    calculateContrastRatio(color.hex, background);
  };

  const handleBackgroundChange = (color) => {
    setBackground(color.hex);
    calculateContrastRatio(foreground, color.hex);
  };


  const calculateContrastRatio = (fg, bg) => {
    const fgLuminance = luminance(hexToRgb(fg));
    const bgLuminance = luminance(hexToRgb(bg));

    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    setContrastRatio(ratio.toFixed(2));

    if (ratio >= 7) {
      setComplianceLevel('AAA');
    } else if (ratio >= 4.5) {
      setComplianceLevel('AA');
    } else {
      setComplianceLevel('Fail');
    }
  };

  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const luminance = (rgb) => {
    let a = [rgb.r/255, rgb.g/255, rgb.b/255].map((v) => {
      if (v <= 0.03928) {
        return v / 12.92;
      }
      return Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };


  return (
    <div>
      <div>
        <label htmlFor="foreground">Foreground Color:</label>
        <ColorPicker color={foreground} onChange={handleForegroundChange} />
        <span style={{ backgroundColor: foreground, padding: '5px', border: '1px solid black', marginLeft: '10px' }}>Example Text</span>

      </div>
      <div>
        <label htmlFor="background">Background Color:</label>
        <ColorPicker color={background} onChange={handleBackgroundChange} />
          <span style={{ backgroundColor: background, padding: '5px', border: '1px solid black', marginLeft: '10px'}}>Example Text</span>
      </div>
      <div>
        Contrast Ratio: {contrastRatio}:1
        <br/>
        WCAG Compliance: {complianceLevel}
      </div>
    </div>
  );
}

export default ColorContrastChecker;


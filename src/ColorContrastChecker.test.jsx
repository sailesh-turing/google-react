import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColorContrastChecker from './ColorContrastChecker';
import { act } from 'react-dom/test-utils';  // For asynchronous actions with ColorPicker

const ID_FOREGROUND_COLOR_PICKER = "foreground-color-picker";
const ID_BACKGROUND_COLOR_PICKER = "background-color-picker";
const ID_PREVIEW = "preview";

// Helper function to simulate color picker change
const changeColor = (pickerId, hexColor) => {
  act(() => {
    fireEvent.change(screen.getByTestId(pickerId).querySelector('input'), { target: { value: hexColor } });
  });
};

describe('ColorContrastChecker', () => {
  it('renders without crashing (Requirement 1)', () => {
    render(<ColorContrastChecker />);
  });

  it('displays the title', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByRole('heading', { level: 1, name: /Color Contrast Checker/i })).toBeInTheDocument();
  });

  it('displays the foreground-color-picker', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByTestId(ID_FOREGROUND_COLOR_PICKER)).toBeInTheDocument();
  });

  it('displays text input for foreground-color-picker', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByTestId(ID_FOREGROUND_COLOR_PICKER).querySelector('input')).toBeInTheDocument();
  });

  it('displays the background-color-picker', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByTestId(ID_BACKGROUND_COLOR_PICKER)).toBeInTheDocument();
  });

  it('displays text input for background-color-picker', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByTestId(ID_BACKGROUND_COLOR_PICKER).querySelector('input')).toBeInTheDocument();
  });

  it('displays preview text', () => {
    render(<ColorContrastChecker />);
    const preview = screen.getByTestId(ID_PREVIEW);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent("Lorem ipsum");

    changeColor("foreground-color-picker", "#000000"); // Black foreground
    changeColor("background-color-picker", "#FFFFFF"); // White background

    expect(preview).toHaveStyle('color: #000000');
    expect(preview).toHaveStyle('backgroundColor: #FFFFFF');
  });

  it('displays contrast ratio', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByText(/Contrast Ratio:/i)).toBeInTheDocument();
  });

  it('displays compliance rating', () => {
    render(<ColorContrastChecker />);
    expect(screen.getByText(/WCAG compliance:/i)).toBeInTheDocument();
  });

  it('shows correct compliance for low contrast', () => {
    render(<ColorContrastChecker />);
    changeColor(ID_FOREGROUND_COLOR_PICKER, "#777777");
    changeColor(ID_BACKGROUND_COLOR_PICKER, "#888888");
    expect(screen.getByText(/Contrast Ratio:/i).textContent).toContain("1.26:1");
    expect(screen.getByText(/WCAG Compliance:/i).textContent).toContain("Fail");
  });

  it('shows correct compliance for AA contrast', () => {
    render(<ColorContrastChecker />);
    changeColor(ID_FOREGROUND_COLOR_PICKER, "#000000");
    changeColor(ID_BACKGROUND_COLOR_PICKER, "#8a8a8a");
    expect(screen.getByText(/Contrast Ratio:/i).textContent).toContain("6.08:1");
    expect(screen.getByText(/WCAG Compliance:/i).textContent).toContain("AA");
  });

  it('shows correct compliance for AAA contrast', () => {
    render(<ColorContrastChecker />);
    changeColor(ID_FOREGROUND_COLOR_PICKER, "#000000");
    changeColor(ID_BACKGROUND_COLOR_PICKER, "#ababab");
    expect(screen.getByText(/Contrast Ratio:/i).textContent).toContain("9.14:1");
    expect(screen.getByText(/WCAG Compliance:/i).textContent).toContain("AAA");
  });
});

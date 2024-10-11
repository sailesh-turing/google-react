import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlphabetGame from './AlphabetGame'; // Import your component


describe('AlphabetGame Component', () => {
    test('Renders without crashing', () => {
        render(<AlphabetGame />);
    });

    test('Displays the title', () => {
        render(<AlphabetGame />);
        expect(screen.getByRole('heading', { level: 1, name: /Alphabet Game/i })).toBeInTheDocument();
    });

    test('Displays the question alphabet', () => {
        render(<AlphabetGame />);
        expect(screen.getByText(/Current Letter:/i)).toBeInTheDocument();
        expect(screen.getByText(/Current Letter:/i)).toHaveTextContent(/^Current Letter: [a-z]$/);

    });

    test('Allows player to type an answer', () => {
        render(<AlphabetGame />);
        const input = screen.getByRole('textbox');
        expect(input).toBeEmptyDOMElement();
        fireEvent.change(input, { target: { value: 'a' } });
        expect(input.value).toBe('a');
    });

    test('Limits player input to one character', () => {
        render(<AlphabetGame />);
        const input = screen.getByRole('textbox');
        expect(input).toBeEmptyDOMElement();
        fireEvent.change(input, { target: { value: 'a' } });
        expect(input.value).toBe('a');
        fireEvent.change(input, { target: { value: 'ab' } }); // Try typing more than one character
        expect(input.value).toBe('a'); // Should still only have one character
    });

    test('Has a Check button', () => {
        render(<AlphabetGame />);
        expect(screen.getByRole('button', { name: /Check/i })).toBeInTheDocument();
    });

    describe('Answer checking and feedback', () => {
        let input, checkButton, currentLetter;

        beforeEach(() => {
            render(<AlphabetGame />);
            input = screen.getByRole('textbox');
            checkButton = screen.getByRole('button', { name: /Check/i });
            currentLetter = screen.getByText(/Current Letter:/i).textContent.slice(-1);
        });

        test('Displays "Correct!" for correct answer', async () => {
            const nextLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
            fireEvent.change(input, { target: { value: nextLetter } });
            fireEvent.click(checkButton);
            await waitFor(() => expect(screen.getByText("Correct!")).toBeVisible());
        });


        test('Displays "Incorrect" for wrong answer', () => {
            const nextToNextLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 2);
            fireEvent.change(input, { target: { value: nextToNextLetter } });
            fireEvent.click(checkButton);
            expect(screen.getByText("Incorrect. Try again!")).toBeVisible();

        });

        test('Allows changing answer after incorrect guess', () => {
            const nextToNextLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 2);
            fireEvent.change(input, { target: { value: nextToNextLetter } });
            fireEvent.click(checkButton);
            fireEvent.change(input, { target: { value: '' } }); //Clear
            expect(input.value).toBe(''); //Can delete previous answer

        });
    });



    describe('Score updates', () => {
        test('Correct answer increases score', async () => {
            render(<AlphabetGame />);
            const scoreElement = screen.getByText(/Score: /i);
            const initialScore = parseInt(scoreElement.textContent.split(': ')[1]);

            const currentLetter = screen.getByText(/Current Letter:/i).textContent.slice(-1);
            const nextLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
            const input = screen.getByRole('textbox');
            const checkButton = screen.getByRole('button', { name: /Check/i });

            fireEvent.change(input, { target: { value: nextLetter } });
            fireEvent.click(checkButton);

            await waitFor(() => expect(screen.getByText(/Score: /i)).toHaveTextContent(`Score: ${initialScore + 1}`));
        });

        test('Wrong answer should not change the score', async () => {
            render(<AlphabetGame />);
            const scoreElement = screen.getByText(/Score: /i);
            const initialScore = parseInt(scoreElement.textContent.split(': ')[1]);

            const currentLetter = screen.getByText(/Current Letter:/i).textContent.slice(-1);
            const nextToNextLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 2);
            const input = screen.getByRole('textbox');
            const checkButton = screen.getByRole('button', { name: /Check/i });

            fireEvent.change(input, { target: { value: nextToNextLetter } });
            fireEvent.click(checkButton);

            await waitFor(() => expect(screen.getByText(/Score: /i)).toHaveTextContent(`Score: ${initialScore}`));
        });
    });

    test('Player should not be allowed to submit empty answer', () => {
        render(<AlphabetGame />);
        const input = screen.getByRole('textbox');
        expect(input).toBeEmptyDOMElement();
        const checkButton = screen.getByRole('button', { name: /Check/i });
        expect(checkButton).toBeDisabled();
    });

    test("Submitting correct answer should display new question and clear previous UI after delay", async () => {
        render(<AlphabetGame />);

        // Get the current letter
        let currentLetter = screen.getByText(/Current Letter:/i).textContent.slice(-1);
        const nextLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
        let input = screen.getByRole('textbox');
        let checkButton = screen.getByRole('button', { name: /Check/i });

        // Submit the correct answer
        fireEvent.change(input, { target: { value: nextLetter } });
        fireEvent.click(checkButton);

        // Assert correct feedback and input field reset after a delay
        await waitFor(() => {
            expect(screen.getByText("Correct!")).toBeVisible(); //Correct feedback

        });

        await waitFor(() => {
            let nextLetterElement = screen.getByText(/Current Letter:/i);
            expect(nextLetterElement).toHaveTextContent(/^Current Letter: [a-z]$/);
            input = screen.getByRole('textbox');
            expect(input).toBeEmptyDOMElement();

        });
    }, 1500);



});
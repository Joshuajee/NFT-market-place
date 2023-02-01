import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Description from './description';

describe ("Testing Description", () => {

    const details = { name: "", description: ""}

    const setDetails = jest.fn()

    it("Contains the name and description input fields", () => {

        render(<Description details={details}  />);

        const name = screen.getByRole("textbox", { name: /name/i })

        const description = screen.getByRole("textbox", { name: /description/i })

        expect(name).toBeInTheDocument()

        expect(description).toBeInTheDocument()

    })

    it("Input Field works as expected", () => {

        render(<Description details={details} setDetails={setDetails} />);

        const name = screen.getByRole("textbox", { name: /name/i })

        const description = screen.getByRole("textbox", { name: /description/i })

        fireEvent.change(name, {
            target: { value: "John"}
        })

        // only name updates
        expect(setDetails).toBeCalledWith(
            expect.objectContaining({
                name: 'John',
                description: ''
            })
        )

        fireEvent.change(description, {
            target: { value: "I love my Life"}
        })

        // only description updates
        expect(setDetails).toBeCalledWith(
            expect.objectContaining({
                name: '',
                description: 'I love my Life'
            })
        )

    })


})

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from './search';


describe ("Search Bar Test", () => {

    it("Has Input Field and Button", () => {

        render(<Search  />);

        const input = screen.getByRole("textbox", {
            name: "Search Collection address"
        })

        const button = screen.getByRole("button", {
            name: "search"
        })

        expect(input).toBeInTheDocument()
        expect(button).toBeInTheDocument()

    })

    it("Background div is absent when show props is undefined or false (Desktop)", () => {

        render(<Search   />);

        const background = screen.queryByLabelText("invisible")

        expect(background).not.toBeInTheDocument()

    })


    it("Background div is present when show props is true (Mobiles) and close props is called when background is clicked", () => {

        const closeMock =  jest.fn()

        render(<Search show={true}  close={closeMock} />);

        const background = screen.getByLabelText("invisible")

        expect(background).toBeInTheDocument()

        fireEvent.click(background)

        expect(closeMock).toBeCalled()

    })


    it("Search Result dropdown menu is hidden by default", () => {

        render(<Search  />);

        const searchResult = screen.queryByLabelText(/Search Results/i)

        expect(searchResult).not.toBeInTheDocument()

    })


    it("Clicking Search Button will only shows 'Search result dropdown menu' when there is valid address", () => {

        render(<Search  />);

        const button = screen.getByRole("button", {
            name: "search"
        })

        const search = screen.getByRole("textbox", {
            name: "Search Collection address"
        })

        fireEvent.change(search, { target:{ value: "0x0eca8fc72a016d6ea1b036a96dc05072c08a04fe" } })

        fireEvent.click(button)

        const searchResult = screen.getByLabelText(/Search Results/i)

        expect(searchResult).toBeInTheDocument()

    })

})



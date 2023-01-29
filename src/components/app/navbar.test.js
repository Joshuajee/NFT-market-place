import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from './navbar';

jest.mock("./../connection/button", () => {
    return () => {
        return "Connection Button"
    }
})

jest.mock('next/router', () => require('next-router-mock'));



describe ("Testing Navigation", () => {

    it("Logo, Search and connectionBtn are present", () => {

        render(<NavBar />);

        const logo = screen.getByText(/JEE Marketplace/i)
        const searchBox = screen.getByRole("textbox", { name: /Search Collection address/i })
        const connectionBtns = screen.getAllByText(/Connection Button/i)

        expect(logo).toBeInTheDocument()
        expect(searchBox).toBeInTheDocument()

        expect(connectionBtns.length).toBe(2)

    })


    it("Link, Search and Connection Container has the 'hide' class", () => {

        render(<NavBar />);

        const linkContainer = screen.getByLabelText(/link container/i)
        const searchContainer = screen.getByLabelText(/search container/i)
        const connectionContainer = screen.getByLabelText(/connection container/i)

        expect(linkContainer).toHaveClass("hide")
        expect(searchContainer).toHaveClass("hide_mobile")
        expect(connectionContainer).toHaveClass("hide")

    })

    it("Mobile Container has the 'hide_lg' class", () => {

        render(<NavBar />);

        const collaspeContainer = screen.getByLabelText(/collaspe container/i)

        expect(collaspeContainer).toHaveClass("hide_lg")

    })

    it("Side nav is hidden", () => {

        render(<NavBar />);

        const presentation = screen.queryByRole(/presentation/i, {
            name: /Side Navigation/i
        })

        expect(presentation).not.toBeInTheDocument()

    })

    it("Hamburger Menu is present", () => {

        render(<NavBar />);

        const hamburgerMenu = screen.getAllByRole("button")[2]

        expect(hamburgerMenu).toBeInTheDocument()

    })

    it("Clicking Hamburger menu shows side nav", async() => {

        render(<NavBar />);

        const hamburgerMenu = screen.getAllByRole("button")[2]

        fireEvent.click(hamburgerMenu)

        const presentation = screen.getByRole(/presentation/i, {
            name: /Side Navigation/i
        })

        expect(presentation).toBeInTheDocument()

    })

    it("Clicking Hamburger Search Icon hides the following: Link, Search and Connection Container and shows Search with invisible background", async() => {

        render(<NavBar />);

        const searchIcon = screen.getAllByRole("button")[1]

        fireEvent.click(searchIcon)

        const linkContainer = screen.queryByLabelText(/link container/i)
        const searchContainer = screen.queryByLabelText(/search container/i)
        const connectionContainer = screen.queryByLabelText(/connection container/i)
        
        const background = screen.getByLabelText("invisible")


        expect(linkContainer).not.toBeInTheDocument()
        expect(searchContainer).not.toBeInTheDocument()
        expect(connectionContainer).not.toBeInTheDocument()

        expect(background).toBeInTheDocument()

    })

})
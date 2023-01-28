import { findAllByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from './menu';

jest.mock("./../connection/button", () => {
    return () => {
        return "Connection Button"
    }
})


const renderComponent = () => {
    render(<Menu open={true} />);
}

describe ("Testing Side Menu", () => {

    it("Renders no links when open is false", () => {

        render(<Menu open={false} />);

        //expect(screen.queryAllByRole("link")).not.toBeInTheDocument()

    })

    it("Has 4 links", () => {

        renderComponent()

        const links = screen.getAllByRole("link")

        expect(links.length).toBe(4)

    })


    it("Marketplace link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /market place/i
        })

        expect(link).toHaveAttribute('href', '/');

    })

    it("Profile link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /my profile/i
        })

        expect(link).toHaveAttribute('href', '/my-profile');

    })


    it("Sell NFT link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /Sell NFT/i
        })

        expect(link).toHaveAttribute('href', '/sell-nft');

    })

    it("Mint NFT link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /Mint NFT/i
        })

        expect(link).toHaveAttribute('href', '/mint-nft');

    })

})
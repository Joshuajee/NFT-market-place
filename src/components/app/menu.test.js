import { findAllByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from './menu';


const renderComponent = () => {
    render(<Menu open={true} />);
}

describe ("Testing Side Menu", () => {

    it("Renders no links when open is false", () => {

        render(<Menu open={false} />);

        //expect(screen.findAllByRole("link")).toThrowError()

    })

    it("Has 3 links", () => {

        renderComponent()

        const links = screen.getAllByRole("link")

        expect(links.length).toBe(3)

    })



    it("Marketplace link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /marketplace/i
        })

        expect(link).toHaveAttribute('href', '/');

    })

    it("Profile link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /profile/i
        })

        expect(link).toHaveAttribute('href', '/profile');

    })


    it("Sell NFT link has the correct href", () => {

        renderComponent()

        const link = screen.getByRole("link", {
            name: /Sell NFT/i
        })

        expect(link).toHaveAttribute('href', '/sell-nft');

    })

})
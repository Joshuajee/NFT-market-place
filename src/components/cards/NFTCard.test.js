import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import mockRouter from 'next-router-mock';
import NFTCard from './NFTCard';


jest.mock('next/router', () => require('next-router-mock'));


const renderComponent = () => {

    const nft = {
        image: "joshua", 
        name: "Go lang", 
        tokenId: "20", 
        contract: "123k4kgmfkdkfgf" 
    }

    render(<NFTCard nft={nft}  />);

    return nft
}

describe ("NFT card", () => {

    it("testing if everything is present", () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        const name = screen.getByText(nft.name + " #" + nft.tokenId )

        expect(image).toBeInTheDocument()

        expect(name).toBeInTheDocument()

    })

    it("testing image source and alt", () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        expect(image.src).toContain(nft.image)

        expect(image.alt).toContain(nft.name + " " + "#" + nft.tokenId)

    })

    it("testing image click", async () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        fireEvent.click(image)

        expect(mockRouter).toMatchObject({ 
            asPath: "/nft?contract=" + nft.contract + "&" + "tokenId=" + nft.tokenId,
            pathname: "/nft",
            query: { 
                contract: nft.contract, 
                tokenId: nft.tokenId 
            },
        });

    })

})
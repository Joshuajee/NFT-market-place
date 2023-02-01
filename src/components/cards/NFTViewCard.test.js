import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NFTViewCard from './NFTViewCard';


const renderComponent = () => {

    const nft = {
        media: [{gateway: "https://nft-cdn.alchemy.com/matic-mumbai/a04be25f014165ea518e797d8f7115cc"}],
        contract: {
            address: "00000000"
        }, 
        title: "Joshua", 
        tokenId: "1"
    }

    render(<NFTViewCard nft={nft}  />);

    return nft
}

describe ("NFT list cards", () => {

    it("testing if everything is present", () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        const name = screen.getByText(nft.title)

        expect(image).toBeInTheDocument()

        expect(name).toBeInTheDocument()

    })

    it("testing image source and alt", () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        expect(image.src).toContain(nft.media[0].gateway)

        expect(image.alt).toContain(nft.title + " " + "#" + nft.tokenId)

    })

    
})
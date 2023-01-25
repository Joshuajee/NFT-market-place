import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NFTListCard from './NFTListCard';
import { ScreenRotation } from '@mui/icons-material';

const renderComponent = () => {

    const nft = {
        rawMetadata: {
            image: "joshua",
            name: "Golang"
        },
        tokenId: 30, 
        contract: "909049030303030"
    }

    render(<NFTListCard nft={nft}  />);

    return nft
}

describe ("NFT list cards", () => {

    it("testing if everything is present", () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        const name = screen.getByText(nft.rawMetadata.name)

        expect(image).toBeInTheDocument()

        expect(name).toBeInTheDocument()

    })

    it("testing image source and alt", () => {

        const nft  = renderComponent()

        const image = screen.getByRole("img")

        expect(image.src).toContain(nft.rawMetadata.image)

        expect(image.alt).toContain(nft.rawMetadata.name + " " + "#" + nft.tokenId)

    })

    
})
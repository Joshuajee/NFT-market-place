import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Upload from './upload';

describe ("Testing Uploads", () => {

    const seletedImage = "https://nft-cdn.alchemy.com/matic-mumbai/a04be25f014165ea518e797d8f7115cc"

    const setSelectedImage = jest.fn()


    it("File input exist, when selectedImage is null", () => {

        render(<Upload  selectedImage={null} />);

        const fileInput = screen.getByLabelText(/upload input/i)

        expect(fileInput).toBeInTheDocument()

    })


    // it("File input exist, when selectedImage is not null", () => {

    //     render(<Upload  selectedImage={seletedImage} />);

    //     const fileInput = screen.getByLabelText(/upload input/i)

    //     expect(fileInput).toBeInTheDocument()

    // })

})

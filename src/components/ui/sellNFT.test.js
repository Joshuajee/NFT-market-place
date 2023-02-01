import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SellNFT from './sellNFT';

describe ("Test Connection Screen", () => {

    it("Renders", () => {

        render(<SellNFT />);

    })

})
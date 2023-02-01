import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Royalty from './royalty';

describe ("Testing Royalty", () => {

    const royalty = { enabled: true, value: 0 }

    it("Check if the Royalty checkbox is present", () => {

        royalty.enabled = false

        render(<Royalty royalty={royalty} />);

        const royaltyCheck = screen.getByRole("checkbox")

        expect(royaltyCheck).toBeInTheDocument()

    })

    it("Check if the Royalty checkbox and inputs are present", () => {

        render(<Royalty royalty={royalty} />);

        const royaltyCheck = screen.getByRole("checkbox")

        expect(royaltyCheck).toBeInTheDocument()

    })




})

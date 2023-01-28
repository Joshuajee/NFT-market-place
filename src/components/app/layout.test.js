import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './layout';

jest.mock("./../connection/button", () => {
    return () => {
        return "Connection Button"
    }
})

describe ("Testing Layour", () => {

    it("Renders Layout", () => {

        //render(<Layout> <div></div> </Layout>);

    })

})
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from './layout';

describe ("Testing Layour", () => {

    it("Connection information", () => {

        render(<Layout> <div></div> </Layout>);

        screen.debug()




    })

})
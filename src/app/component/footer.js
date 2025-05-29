import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gray-700 flex flex-col-reverse lg:flex-row text-white p-10 justify-center lg:justify-evenly items-left">
            <div className="flex flex-col justify-center pt-4 lg">
                <div className="flex flex-row  items-center justify-center py-4 lg:justify-start">
                    <Image src="/sekolah.png" alt="logo" width={100} height={100} />
                    <h1 className="text-3xl font-bold ">SMA PGRI 1 GOMBONG</h1>
                </div>
                <ul className="flex flex-row gap-4 items-center justify-center lg:justify-start py-4 lg:ml-4 ">
                    <a href="https://www.instagram.com/smapgrigombong?igsh=MW9uNGpud212aHgxYg==" target="_blank" rel="noopener noreferrer">
                        <Image src="/instagram.svg" alt="Follow us on Instagram" width={40} height={40} className="bg-gray-700 p-1 rounded-full" />
                    </a>
                    <a className='justify-center items-center mt-[1%] text-[5vw] md:text-xl'>Follow Our Instagram</a>
                </ul>
                <p className='pt-5 ml-4'>Copyright © 2025 SMA PGRI 1 GOMBONG</p>
                <p className='ml-4'>All rights reserved</p>
            </div>

            <div className="flex flex-col justify-center text-gray-300">
                <h1 className="font-bold py-4 text-lg lg:text-2xl">About</h1>
                <a>NPSN : 20304997</a>
            </div>


        </footer>
    );
};

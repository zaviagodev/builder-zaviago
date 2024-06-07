import { useEffect, useState, Fragment } from 'react';
import { signOut } from 'next-auth/react';
import Site from './site';
import Account from './account';
import Page from './page';
import AssetButton from './assetbutton';
import AddPage from './addpage';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Menu, Transition } from '@headlessui/react';

function Dashboard(props) {

    const [loadedData, setLoadedData] = useState();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(()=>{
        getPages();
    }, []);

    async function getPages(callback) {

        fetch('/api/pages')
        .then(response=>response.json())
        .then(data=>{
            if(callback) callback();
            setLoadedData(data);
        });
    }

    async function logoutHandler() {
        await signOut({redirect: false});
    }

    const bgGradient = {
        background:"linear-gradient(90deg, rgb(248, 247, 247) 0%, rgb(44, 44, 46) 100%)"
    }

    return <>
        <div className={styles.dashboard}>
            <div className={`${isSidebarOpen ? 'bg-black/50 w-screen h-screen fixed top-0 left-0 lg:hidden z-[8]' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`fixed lg:static flex flex-col items-start min-w-[256px] border-r border-r-[#F4F4F4] h-screen bg-white z-[9] ${isSidebarOpen ? 'left-0' : '-left-[100%]'}`}>
                <div className='p-3 border-b border-b-[#F4F4F4] gap-2 w-full'>
                    <button className='p-0 mb-4 bg-white gap-2 items-center lg:hidden' onClick={() => setIsSidebarOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
                        Close
                    </button>

                    <button className='button-normal w-full justify-start hover:bg-gray-100 items-center gap-2' onClick={() => window.open("/", {target: "_blank"})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>
                        View Site
                    </button>
                    <Site mainHost={props.mainHost} owner={props.owner} />
                </div>
                <div className='p-3 border-b border-b-[#F4F4F4] gap-2 w-full'>
                    <AddPage onAdd={getPages} />
                    <AssetButton fileType={'all'}/>
                    <Account />
                </div>
            </div>

            <div className='absolute p-4 border-b border-b-[#F4F4F4] top-0 right-0 w-full lg:w-[calc(100%_-_256px)] bg-white z-[7]'>
                <div className='flex justify-between lg:justify-end'>
                    <button className='p-0 bg-white lg:hidden' onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-right"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
                    </button>
                    <Menu as="div" className={styles.more + ' ml-2'}>
                        <Menu.Button>
                            MENU
                        </Menu.Button>
                        
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">

                            <Menu.Items className={`${styles.moremenu} focus:outline-none !top-10`}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={`${active ? styles.active : ""}`} title={'Logout'} onClick={() => window.location.href = '/admin'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hotel"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
                                            Admin
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button className={`${active ? styles.active : ""}`} title={'Logout'} onClick={logoutHandler}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                            Logout
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>

                        </Transition>
                        
                    </Menu>
                </div>
            </div>

            <div className='px-5 py-8 w-full bg-front-gradient mt-[53px]'>
                <h1>Dashboard</h1>

                <div className="flex flex-wrap">
                    {loadedData?loadedData.pages.map(page=>{
                            return (
                                <Page key={page.slug} slug={page.slug} title={page.title} online={page.online} mainHost={props.mainHost} onUpdate={getPages} />
                            )
                        }):
                        // <div className={styles.dashboard}>
                        <div className='flex justify-center w-full mt-8'>
                            <div className='flex flex-col items-center gap-2'>
                                <div className="animate-spin w-12 h-12 flex justify-center items-center rounded-full" style={bgGradient}>
                                    <div className="bg-white w-10 h-10 rounded-full" />
                                </div>
                                <p>Loading...</p>
                            </div>
                        </div>
                    }
                </div>       

            </div>

        </div>
    </>;
}

export default Dashboard;
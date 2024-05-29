import React, { Fragment, useState, useRef } from 'react';
import Notif from './notif';
import styles from '../styles/Dashboard.module.css';
import { Dialog, Menu, Switch, Transition } from '@headlessui/react';

function User(props) {

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);

    const [notif, setNotif] = useState({});

    const [email, setEmail] = useState(props.email);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [newpassword, setNewPassword] = useState('');
    const [domain, setDomain] = useState(props.domainName);
    const [enabled, setEnabled] = useState(props.enabled)

    const refFocus = useRef(null);

    async function settingsHandler(e) {
        e.preventDefault();

        setSettingsModalIsOpen(true);

        setNewPassword('');
        setShowNewPassword(false);

        // getPageSettings();
    }

    async function saveHandler(e) {
        e.preventDefault();

        setNotif({mode: 'wait', text: 'Saving..'});

        const reqBody = { username: props.username, email: email, newpassword: newpassword, domainName: domain, inactive: !enabled };
        let result = await fetch('/api/usersettings', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onUpdate(()=>{
                setNotif({});
            });
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }

    }

    async function deleteConfirmHandler(e) {
        e.preventDefault();

        setDeleteModalIsOpen(true);
    }

    async function deleteHandler(e) {
        e.preventDefault();

        setNotif({mode: 'wait', text: 'Delete Page..'});
        setDeleteModalIsOpen(false);

        const reqBody = { username: props.username };
        let result = await fetch('/api/deluser', {
            method:'POST',
            body: JSON.stringify(reqBody),
            header: {
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        if(!result.error) { 
            props.onUpdate(()=>{
                setNotif({});
            });
        } else {
            setNotif({mode: 'error', text: result.error});
            setTimeout(()=>{
                setNotif({});
            }, 2000);
        }
    }

    function settingsCloseHandler() {
        if(notif.mode==='wait') return;
        setSettingsModalIsOpen(false);
    }

    function deleteCloseHandler() {
        setDeleteModalIsOpen(false);
    }

    function openNewPassword() {
        setShowNewPassword(true);
        setNewPassword(generatePassword());
    }

    function closeNewPassword() {
        setShowNewPassword(false);
        setNewPassword('');
    }

    function showSvgIcon(s, w, h) {
        if(s==='trash') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M400 113.3h-80v-20c0-16.2-13.1-29.3-29.3-29.3h-69.5C205.1 64 192 77.1 192 93.3v20h-80V128h21.1l23.6 290.7c0 16.2 13.1 29.3 29.3 29.3h141c16.2 0 29.3-13.1 29.3-29.3L379.6 128H400v-14.7zm-193.4-20c0-8.1 6.6-14.7 14.6-14.7h69.5c8.1 0 14.6 6.6 14.6 14.7v20h-98.7v-20zm135 324.6v.8c0 8.1-6.6 14.7-14.6 14.7H186c-8.1 0-14.6-6.6-14.6-14.7v-.8L147.7 128h217.2l-23.3 289.9z"></path><path d="M249 160h14v241h-14zM320 160h-14.6l-10.7 241h14.6zM206.5 160H192l10.7 241h14.6z"></path></svg>
        } else if(s==='online') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M256 48h-.5C140.8 48.3 48 141.3 48 256s92.8 207.7 207.5 208h.5c114.9 0 208-93.1 208-208S370.9 48 256 48zm8.3 124.5c22.1-.6 43.5-3.5 64.2-8.5 6.2 24.5 10.1 52.8 10.7 83.8h-74.9v-75.3zm0-16.7V66c22.4 6.2 45.2 36.1 59.6 82-19.2 4.6-39.1 7.2-59.6 7.8zm-16.6-90v90.1c-20.7-.6-40.8-3.3-60.1-8 14.6-46.2 37.5-76.3 60.1-82.1zm0 106.7v75.2h-75.4c.6-31 4.5-59.3 10.7-83.8 20.8 5 42.5 8 64.7 8.6zm-92.2 75.2H64.9c1.8-42.8 17.8-82 43.3-113 18.5 10.2 38.2 18.6 58.8 24.8-6.8 26.5-10.8 56.4-11.5 88.2zm0 16.6c.6 31.7 4.6 61.7 11.4 88.2-20.6 6.3-40.2 14.6-58.8 24.8-25.5-31-41.4-70.2-43.3-113h90.7zm16.8 0h75.4v75.1c-22.2.6-43.9 3.6-64.7 8.7-6.2-24.5-10.1-52.8-10.7-83.8zm75.4 91.8v90.2c-22.6-5.9-45.5-35.9-60.1-82.1 19.3-4.8 39.4-7.5 60.1-8.1zm16.6 89.9v-90c20.5.6 40.4 3.3 59.7 7.9-14.5 46-37.2 75.9-59.7 82.1zm0-106.6v-75.1h74.9c-.6 30.9-4.5 59.2-10.7 83.7-20.7-5-42.1-8-64.2-8.6zm91.6-75.1h91.2c-1.8 42.8-17.8 81.9-43.3 113-18.7-10.3-38.5-18.7-59.3-25 6.8-26.5 10.8-56.3 11.4-88zm0-16.6c-.6-31.7-4.6-61.6-11.3-88.1 20.8-6.3 40.6-14.7 59.2-24.9 25.5 31 41.5 70.2 43.3 113.1h-91.2zm36.5-125.8c-16.6 8.8-34 16.1-52.3 21.6-9.7-31.3-23.4-56.8-39.5-73.6 35.4 8.5 67 26.9 91.8 52zM210.8 70.1c-16.1 16.7-29.7 42.2-39.3 73.3-18.1-5.5-35.4-12.7-51.8-21.5 24.5-25 55.9-43.3 91.1-51.8zM119.6 390c16.4-8.8 33.8-16 51.8-21.5 9.7 31.2 23.3 56.6 39.4 73.4-35.2-8.5-66.6-26.8-91.2-51.9zm181 52.1c16.2-16.8 29.8-42.3 39.6-73.7 18.3 5.5 35.7 12.8 52.3 21.6-24.8 25.2-56.5 43.6-91.9 52.1z"></path></svg>
        } else if(s==='more') {
            return <svg style={{width:w+'px', height:h+'px'}} viewBox="0 0 512 512"><path d="M296 136c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0 240c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0-120c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40z"/></svg>
        }
    }
    function generatePassword() {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
                'abcdefghijklmnopqrstuvwxyz0123456789@#$';
          
        for (let i = 1; i <= 8; i++) {
            let char = Math.floor(Math.random()
                        * str.length + 1);
              
            pass += str.charAt(char)
        }
          
        return pass;
    }

    return <>
        <div className={styles.user}>


        <Menu as="div" className={styles.more}>
                
                <Menu.Button>
                    {showSvgIcon('more', 25, 25)}
                </Menu.Button>
                
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">

                    <Menu.Items className={`${styles.moremenu} focus:outline-none`}>
                        
                        <Menu.Item>
                            {({ active }) => (
                                <button className={`${active ? styles.active : ""}`}  title={'Settings'} onClick={settingsHandler}>Settings</button>
                            )}
                        </Menu.Item>
                    
                        {props.username!=='admin'?
                        <>
                            <div className={styles.menuseparator}></div>
                            <Menu.Item>
                                {({ active }) => (
                                    <button className={` ${active ? styles.active : ""}`}  title={'Delete'} onClick={deleteConfirmHandler}>Delete</button>
                                )}
                            </Menu.Item>
                            
                        </>:null}   
                    </Menu.Items>

                </Transition>
                
            </Menu>

            <h4 className='text-xl font-normal'>{props.username}{props.enabled?'':<>
            <span className='ml-2 font-light text-sm text-red-700'>inactive</span>
            </>}</h4>
            <div className='mt-3 text-sm'>{props.email}</div>
            {props.domainName?<div className='mt-3 text-sm'>{props.domainName}</div>:
            <div className='mt-3 text-sm text-gray-400'>No Domain</div>}
        </div>

        <Transition appear show={settingsModalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            initialFocus={refFocus}
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={settingsCloseHandler}>

            <Notif mode={notif.mode} text={notif.text} duration={notif.duration} />

            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className={`${styles.modal}`}>
                    
                    <Dialog.Title as="h3">User Settings</Dialog.Title>

                    <form className='mt-6 space-y-6' onSubmit={saveHandler}>
                
                        <div>
                            <label>Username: {props.username}</label>
                        </div>
                        <div>
                            <label htmlFor='email'>Email:</label>
                            <div className='mt-1'>
                                <input ref={refFocus} type='text' id="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label>New Password:</label>
                            <div className='mt-1'>
                                <button className='button-normal' onClick={openNewPassword} type='button'>Set New Password</button>
                            </div>
                            {showNewPassword?<>
                                <div className='mt-2 flex'>
                                    <input type='text' id="newpassword" required value={newpassword} onChange={(e)=>setNewPassword(e.target.value)} />
                                    <button onClick={closeNewPassword} className='button-normal ml-1' type='button'>Cancel</button>
                                </div>
                            </>:null}
                        </div>
                        
                        {props.username==='admin'?<>
                            <div>
                                <label>Main Domain: {props.domainName}</label>
                            </div>
                        </>:<>
                            <div>
                                <label htmlFor='domain'>Custom Domain:</label>
                                <div className='mt-1'>
                                    <input type='text' id="domain" value={domain} onChange={(e)=>setDomain(e.target.value)} />
                                </div>
                            </div>
                        </>}

                        {props.username!=='admin'?<>
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch
                                    checked={enabled}
                                    onChange={setEnabled}
                                    className={`${
                                        enabled ? 'bg-indigo-600' : 'bg-gray-200'
                                    } relative inline-flex items-center h-7 rounded-full w-12 px-0 justify-start`}
                                    >
                                    <span className="sr-only">Active</span>
                                    <span
                                        className={`${
                                        enabled ? 'translate-x-[23px]' : 'translate-x-1'
                                        } inline-block w-5 h-5 transform bg-white rounded-full`}
                                    />
                                </Switch>
                                <Switch.Label className="ml-2">Active</Switch.Label>
                            </div>
                        </Switch.Group>
                        </>:null}

                        <div>
                            <button className="button-primary w-full" type="submit">Update</button>
                        </div>

                    </form>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

        <Transition appear show={deleteModalIsOpen} as={Fragment}>
            <Dialog
            as="div"
            className={`${styles.dashboard} fixed inset-0 z-10 overflow-y-auto`}
            onClose={deleteCloseHandler}>

            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className={`${styles.modal}`}>

                    <p>Are you sure you want to delete this user?</p>

                    <h3 className='mt-6 mb-8'>{props.username}</h3>
                        
                    <form onSubmit={deleteHandler}>
                        <div>
                            <button className='button-warning w-full'>Delete</button>
                        </div>
                    </form>

                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>

        <Notif mode={notif.mode} text={notif.text} duration={notif.duration} />
    </>
}

export default User;
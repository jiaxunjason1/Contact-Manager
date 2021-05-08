import React, { useState, useContext, useEffect, Fragment } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {
    const contactContext = useContext(ContactContext);

    const { addContact, clearCurrent, updateContact, current } = contactContext;

    useEffect(() => {
        if(current !== null) {
            setContact(current);
            setExtraCount(current.extraInfo.length);
        } else {
            setContact({
                name: '',
                email: '',
                phone: '',
                type: 'personal',
                extraInfo: []
            });
            setExtraCount(0);
        }
    }, [contactContext, current]);

    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'personal',
        extraInfo: []
    });

    const [extraCount, setExtraCount] = useState(0);

    const { name, email, phone, type, extraInfo } = contact;

    const onChange = e => {
        if(e.target.name.slice(0,5) === 'label') {
            const id = e.target.name.slice(6);
            setContact({ 
                ...contact,
                extraInfo: contact.extraInfo.map(listItem => listItem.id === id 
                    ? { ...listItem, label: e.target.value } 
                    : listItem)
             });
        } else if (e.target.name.slice(0,7) === 'content') {
            const id = e.target.name.slice(8);
            setContact({
                ...contact,
                extraInfo: contact.extraInfo.map(listItem => listItem.id === id 
                    ? { ...listItem, content: e.target.value } 
                    : listItem)
            });
        } else {
            setContact({ ...contact, [e.target.name]: e.target.value });
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        if(current === null) {
            addContact(contact);
        } else {
            updateContact(contact);
        }
        clearAll();
    }

    const clearAll = () => {
        clearCurrent();
    }

    const onClick = e => {
        if(extraCount < 10 && e.target.name === 'add') {
            setContact({
                ...contact,
                extraInfo: [...contact.extraInfo, { id: extraCount.toString(), label: '', content: '' }]
            });
            setExtraCount(extraCount + 1);
        } else if (extraCount > 0 && e.target.name === 'remove') {
            setContact({
                ...contact,
                extraInfo: contact.extraInfo.filter(listItem => 
                    listItem.id !== (extraCount - 1).toString())
            });
            setExtraCount(extraCount - 1);
        }
    }

    return (
        <Fragment>
        <form onSubmit={onSubmit}>
            <h2 className='text-primary'>{current ? 'Edit Contact' : 'Add Contact'}</h2>
            <input 
                type='text' 
                placeholder='Name' 
                name='name' 
                value={name} 
                onChange={onChange}
                required>
            </input>
            <input 
                type='email' 
                placeholder='Email' 
                name='email' 
                value={email} 
                onChange={onChange}>
            </input>
            <input 
                type='text' 
                placeholder='Phone' 
                name='phone' 
                value={phone} 
                onChange={onChange}>
            </input>
            {extraInfo.length > 0 && extraInfo.map(listItem => 
                <div key={listItem.id} className='grid-2'>
                    <input
                        type='text'
                        placeholder='Label'
                        name={'label-'+listItem.id}
                        value={listItem.label}
                        onChange={onChange}
                        required>
                    </input>
                    <input
                        type='text'
                        placeholder='Info'
                        name={'content-'+listItem.id}
                        value={listItem.content}
                        onChange={onChange}
                        required>
                    </input>
                </div>)}
            <h5>Contact Type</h5>
            <input 
                type='radio' 
                name='type'
                value='personal'
                checked={type === 'personal'} 
                onChange={onChange}
            /> Personal {' '}
            <input 
                type='radio' 
                name='type'
                value='professional'
                checked={type === 'professional'} 
                onChange={onChange}
            /> Professional
            <div>
                <input
                    type='submit'
                    value={current ? 'Update Contact' : 'Add Contact'}
                    className='btn btn-primary btn-block'
                />
            </div>
            {current && <div>
                <button className='btn btn-light btn-block' onClick={clearAll}>Clear</button>
            </div>}
        </form>
        {extraCount < 10 && 
        <button className='btn btn-dark btn-block my-1' onClick={onClick} name='add'>
                Add Info Field
        </button>}
        {extraCount > 0 && 
        <button className='btn btn-danger btn-block my-1' onClick={onClick} name='remove'>
            Remove Info Field
        </button>}
        </Fragment>
    )
}

export default ContactForm

import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ListComponent.css';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  gender: Yup.string().required('Gender is required'),
  occupation: Yup.string().required('Occupation is required'),
});

interface Person {
  id: number;
  name: string;
  address: string;
  gender: string;
  occupation: string;
}

const emptyPerson: Omit<Person, 'id'> = {
  name: '',
  address: '',
  gender: '',
  occupation: ''
};

const ListComponent: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalPerson, setModalPerson] = useState<Omit<Person, 'id'>>(emptyPerson);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const apiUrl = '/api/people';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const fetchPeople = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to load people');
      const data = await response.json();
      const sortedData = data.sort((a: Person, b: Person) => b.id - a.id);
      setPeople(sortedData);
    } catch (error) {
      console.warn('Unable to load people from server.', error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setModalPerson(emptyPerson);
    setModalOpen(true);
  };

  const openEditModal = (person: Person) => {
    setModalMode('edit');
    setEditingId(person.id);
    setModalPerson({
      name: person.name,
      address: person.address,
      gender: person.gender,
      occupation: person.occupation,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalPerson(emptyPerson);
    setEditingId(null);
  };

  const savePerson = async (values: {
  name: string;
  address: string;
  gender: string;
  occupation: string;
}) => {
  try {
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    const url = modalMode === 'add' ? apiUrl : `${apiUrl}/${editingId}`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values), // ✅ use Formik values
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error || 'Unable to save person';
      throw new Error(message);
    }

    const updatedPeople = await response.json();
    const sortedPeople = updatedPeople.sort(
      (a: Person, b: Person) => b.id - a.id
    );

    setPeople(sortedPeople);

    if (modalMode === 'add') {
      const newPersonId = sortedPeople[0]?.id;
      setLastAddedId(newPersonId);
      showToast('🎉 Person added successfully!', 'success');
      setTimeout(() => setLastAddedId(null), 2000);
    } else {
      showToast('✓ Person updated successfully!', 'success');
    }

  } catch (error) {
    console.error('Unable to save person:', error);
    const errorMsg =
      error instanceof Error ? error.message : 'Unknown error';
    showToast(errorMsg, 'error');
  }
};

  const openConfirmDelete = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${pendingDeleteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Unable to delete person');
      const updatedPeople = await response.json();
      const sortedPeople = updatedPeople.sort((a: Person, b: Person) => b.id - a.id);
      setPeople(sortedPeople);
      cancelDelete();
    } catch (error) {
      console.warn('Unable to delete person.', error);
    }
  };

   const updateField = (field: keyof Omit<Person, 'id'>, value: string) => {
    setModalPerson(prev => ({ ...prev, [field]: value }));
  }; 

  return (
    <div className="list-component">
      <div className="page-center">
        <div className="card">
          <h2>People Manager</h2>
          <p>Open the modal to add or edit people records with a centered experience.</p>
          <button className="primary-button" onClick={openAddModal}>Add New Person</button>
        </div>

        <div className="list-card">
          <h3>People List</h3>
          <ul className="person-list">
            <li className="list-header">
              <span>Name</span>
              <span>Address</span>
              <span>Gender</span>
              <span>Occupation</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </li>
            {people.length === 0 ? (
              <li className="empty-state">No people added yet. Click Add New Person to begin.</li>
            ) : (
              people.map(person => (
                <li key={person.id} className={`list-item ${lastAddedId === person.id ? 'list-item-new' : ''}`}>
                  <span>{person.name}</span>
                  <span>{person.address}</span>
                  <span>{person.gender}</span>
                  <span>{person.occupation}</span>
                  <div className="list-item-actions">
                    <button className="icon-button edit-button" onClick={() => openEditModal(person)} title="Edit"><EditIcon fontSize="small" /></button>
                    <button className="icon-button delete-button" onClick={() => openConfirmDelete(person.id)} title="Delete"><DeleteIcon fontSize="small" /></button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

     {modalOpen && (
  <Formik
    initialValues={{
      name: modalPerson.name || '',
      address: modalPerson.address || '',
      gender: modalPerson.gender || '',
      occupation: modalPerson.occupation || '',
    }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      savePerson(values);
      closeModal();
    }}
  >
    {() => (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>

          <Form>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>
                {modalMode === 'add' ? 'Add New Person' : 'Edit Person'}
              </h3>

              <div className="modal-actions" style={{ margin: 0 }}>
                <button type="button" className="secondary-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {modalMode === 'add' ? 'Create' : 'Save'}
                </button>
              </div>
            </div>

            <div className="input-grid">

              <div>
                <Field name="name" placeholder="Name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              <div>
                <Field name="address" placeholder="Address" />
                <ErrorMessage name="address" component="div" className="error" />
              </div>

              <div>
                <Field name="gender" placeholder="Gender" />
                <ErrorMessage name="gender" component="div" className="error" />
              </div>

              <div>
                <Field name="occupation" placeholder="Occupation" />
                <ErrorMessage name="occupation" component="div" className="error" />
              </div>

            </div>
          </Form>

        </div>
      </div>
    )}
  </Formik>
)}

      {confirmOpen && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Confirm Delete</h3>
              <div className="modal-actions" style={{ margin: 0 }}>
                <button className="secondary-button" onClick={cancelDelete}>Cancel</button>
                <button className="primary-button" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
            <p className="confirm-text">Are you sure you want to delete this record? This action cannot be undone.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListComponent;

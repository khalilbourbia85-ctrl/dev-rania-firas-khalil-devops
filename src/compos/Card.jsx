import Styles from './Card.module.css';
import Stle from '../assets/kantaoui.jfif';
import { useState } from 'react';

function Card(props) {
  const [visible, setVisible] = useState(false);
  const [book, setBook] = useState(false);

  function bookNow() {
    setBook(true); // show form
  }

  function cancelBooking() {
    setBook(false); // hide form
  }

  function toggle() {
    setVisible(!visible);
  }
  function HotelRating({ stars }) {
  const totalStars = 5; // max stars (optional)
  return (
    <div>
      {"★".repeat(stars)}{"☆".repeat(totalStars - stars)}
    </div>
  );
}


  return (
    <> 
      <div className="all">
        <div className={Styles.card}>
          <img src={Stle} className={Styles.img} alt="pas" />
          {!visible && (
                 <>
                 <div className={Styles.bas}>

                 
                 <h5 className="card-title">{props.title}</h5>
                 <p className="card-text">{props.description}</p>
                 </div>
  </>
)}

          {visible && (
            <>
              <ul className={Styles.ul}>
                <li className="list-group-item">Price/ per day : {props.price}</li>
                <li className="list-group-item">Location : {props.location}</li>
            <HotelRating stars={props.stars} />

              </ul>
              <div className={Styles.westi}>
                <a href="https://www.google.com/travel/search?qs=MhRDZ3NJaHNQVDVlTHJzWUhuQVJBQjgASAA&ts=CAEaNQoVEhMKCS9tLzAzeXY2cjoGU291c3NlEhwSFAoHCOkPEAwYARIHCOkPEAwYAhgBMgQIABAAKgcKBToDVE5E&utm_campaign=sharing&utm_medium=link_btn&utm_source=htls" className="card-link">Map</a>
                <button onClick={bookNow} className={Styles.book}>Book Now</button>
              </div>
            </>
          )}

          <button onClick={toggle} className={Styles.btnToggle}>
            {visible ? 'hidi l det' : 'Showili Det'}
          </button>
        </div>
      </div>

      {/* Overlay booking form */}
      {book && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(207, 191, 191, 0.5)',
          width: '100%',
          height: '100%',
          alignContent: 'center',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          
          
      
          
          
        }}>
          <div className="card shadow-sm p-4" style={{ width: '600px', maxWidth: '95%' }}>
            <h2 className="card-title mb-4 text-center">Réserver une chambre</h2>
            <form id="hotelBookingForm">
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="checkIn" className="form-label">Check-in</label>
                  <input type="date" className="form-control" id="checkIn" name="checkIn" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="checkOut" className="form-label">Check-out</label>
                  <input type="date" className="form-control" id="checkOut" name="checkOut" required />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="adults" className="form-label">Adultes</label>
                  <select className="form-select" id="adults" name="adults" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="children" className="form-label">Enfants</label>
                  <select className="form-select" id="children" name="children">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="roomType" className="form-label">Type de chambre</label>
                <select className="form-select" id="roomType" name="roomType" required>
                  <option value="single">Simple</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">Nom complet</label>
                  <input type="text" className="form-control" id="name" name="name" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" required />
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">Réserver maintenant</button>
                <button type="button" onClick={cancelBooking} className="btn btn-secondary">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;

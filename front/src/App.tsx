import { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { apis } from './enum/api';
import { Reservation } from './interface/Reservasion';
import { asyncGet } from './utils/fetch';
import { ListGroup } from 'react-bootstrap';
import './App.css'

// 轉換create_time格式
function time_transfrom(time: string) {
  const date = new Date(time);
  return date.toLocaleString();
}

// main
function App() {

  const [reservations, setReservations] = useState<Array<Reservation>>([]);
  const [search, setSearch] = useState<string>('');
  const [filteredReservations, setFilteredReservations] = useState<Array<Reservation>>([]);

  // 取得所有預約
  useEffect(() => {
    let ignore = false;
    asyncGet(apis.getReservations).then((data: Array<Reservation>) => {
      if (ignore) {
        setReservations(data)
      }
    });
    return () => {
      ignore = true;
    };
  }, []);
  
  // 搜尋過濾資料
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredReservations(reservations); // 沒有輸入則顯示全部
    } else {
      const filtered = reservations.filter(r =>
        r.student_id.includes(search)
      );
      setFilteredReservations(filtered);
    }
  }, [search, reservations]);

  //subTitle, serach
  const subTitle = (
    <>
      <h2>Reservations ({filteredReservations.length})</h2>
      <InputGroup className="input">
        <Form.Control
          placeholder="Enter Student id..."
          aria-describedby="basic"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" id="button">
          搜尋
        </Button>
      </InputGroup>
    </>);

  const reservationsList = filteredReservations
    ? filteredReservations.map((r: Reservation) => {
      return (
        <Card className="Card" style={{ width: '18rem' }}>
          <Card.Img variant="top" src="images/card.jpg" />
          <Card.Body>
            <Card.Title>Reservation {r.reservation_id}</Card.Title>
            <hr />
            <Card.Text>
              <ListGroup variant='flush'>
                <ListGroup.Item variant=''>學號：{r.student_id}</ListGroup.Item>
                <ListGroup.Item variant=''>姓名：{r.student_name}</ListGroup.Item>
                <ListGroup.Item variant=''>座位：{r.seat_id}</ListGroup.Item>
                <ListGroup.Item variant=''>時段：{r.timeslot_id} ({r.start_time}~{r.end_time})</ListGroup.Item>
                <ListGroup.Item variant=''>{time_transfrom(r.create_time)} 創建</ListGroup.Item>
              </ListGroup>
            </Card.Text>
            <hr />
          </Card.Body>
        </Card>
      );
    })
    : "loading...";

  return (
    <>
      <div className="title">
        <h1>Lab B310 Reservations List</h1>
      </div>
      <div className="sub-title">
        {subTitle}
      </div>
      <div className='main'>
        {reservationsList}
      </div>
    </>
  )
}

export default App

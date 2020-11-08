///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";
import fs from "fs";
import low from "lowdb";
import path from "path";
import FileSync from "lowdb/adapters/FileSync";
import { DbSchema } from "../../client/src/models/db-schema";
import { OneWeek } from './timeFrames';

// some useful database functions in here:
import db from "./database";

const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get('/all', (req: Request, res: Response) => {
  res.send(db.get('events'))
});

router.get('/all-filtered', (req: Request, res: Response) => {
  let {sorting, offset, search} = req.query;
  delete req.query.offset;
  delete req.query.sorting;
  delete req.query.limit;
  delete req.query.page;
  delete req.query.search;
  if (req.query.type)
  {
    req.query.name = req.query.type;
    delete req.query.type;
  }
  let data = db.get('events')
    .filter(search ? event => event.session_id.includes(search) : {})
    .filter(req.query || {})
    //.take(parseInt(offset) || 10)
    .sortBy('date')
    .value()
  
  sorting === '+date' ? res.send({events: data.slice(0 , offset) , more: data.length > offset ? true : false}) : res.send({events: data.reverse().slice(0 , offset) , more: data.length > offset ? true : false});
});

router.get('/by-days/:offset', (req: Request, res: Response) => {
  let dayZero = +req.params.offset;
  const day = 86400000;
  const week = 604800000;
  dayZero = new Date(new Date().toDateString()).getTime() - (dayZero * day);
  let start = dayZero;
  let array : Array<object> = [];
  
  while (start > dayZero - week)
  {
    let sessions : Array<string> = [];
    let data = db.get('events').filter(event => event.date >= start && event.date < start + day).map('session_id').value();
    data.forEach(id => !sessions.includes(id) && sessions.push(id));
    array.push(
      {
        date: new Date(start + 3600000).toDateString(), 
        count: sessions.length
      }
    );
    start -= day;
  }
  res.send(array.reverse());
});

router.get('/by-hours/:offset', (req: Request, res: Response) => {
  let dayZero = +req.params.offset;
  const day = 86400000;
  const hour = 3600000;
  dayZero = new Date(new Date().toDateString()).getTime() - (dayZero * day);
  let start = dayZero;
  let array : Array<object> = [];
  
  while (start < dayZero + day)
  {
    let sessions : Array<string> = [];
    let data = db.get('events').filter(event => event.date >= start && event.date < start + hour).map('session_id').value();
    data.forEach(id => !sessions.includes(id) && sessions.push(id));
    if (dayZero < new Date(2020 , 9 ,25).getTime())
    {
      array.push(
        {
          date: new Date(start + 3600000 - (2 * hour)).getHours() + ':00', 
          count: sessions.length
        });
    }
    else 
    {
      array.push(
        {
          date: new Date(start + 3600000 - hour).getHours() + ':00', 
          count: sessions.length
        });
    }
    start += hour;
  }
  res.send(array);
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {

  let {dayZero} = req.query;
  const hour = 3600000;
  dayZero = new Date(new Date(+dayZero).toDateString()).getTime();
  let allRetentions = [];
  const week = 604800000;
  let start = dayZero;
  let end = start + week;

  const getOneWeekRetention = (start: number , end: number , weekNumber: number) => {
    let retention = [100];
    let counter = 0;
    let signup = db.get('events').filter({name: 'signup'}).filter(event => event.date >= start && event.date < end).sortBy('date').value();
    let dates = [start, end];
    start = end;
    end += week;

    while (start < new Date(new Date()).getTime())
    {
      let data = db.get('events').filter(event => event.date >= start && event.date < end).map('distinct_user_id').value();

      for (let i = 0; i < signup.length; i++)
      {
        if (data.includes(signup[i].distinct_user_id))
        {
          counter++;
        }
      }
      retention.push(Math.round((counter / signup.length) * 100));
      counter = 0;
      start = end;
      end += week;
    }

    return {
      registrationWeek: weekNumber, 
      newUsers: signup.length, 
      weeklyRetention: retention,
      start: new Date(dates[0]).toDateString(),
      end: dates[1] > Date.now() ? new Date(Date.now()).toDateString() : new Date(dates[1]).toDateString()
    }
  }

  while (start < new Date(new Date().toDateString()).getTime())
  {
    console.log(new Date(start).toDateString() , new Date(end).toDateString());
    
    if (new Date(start).toDateString() === new Date(2020,9,25).toDateString())
    {
      end -= (2 * hour);
      console.log('happened');
    }
    allRetentions.push(getOneWeekRetention(start , end , allRetentions.length));
    start = end;
    end += week;
  }

  res.send(allRetentions);
});

router.get('/:eventId',(req : Request, res : Response) => {
  res.send(db.get('events').find({_id: req.params.eventId}).value())
});

router.post('/', (req: Request, res: Response) => {
  let { body } = req;
  db.get('events').push(body).write();
  res.status(200).send(body);
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})

export default router;

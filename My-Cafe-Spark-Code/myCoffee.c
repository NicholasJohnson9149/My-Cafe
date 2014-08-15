/**
 ******************************************************************************
 * @file    Sparks New Coffee Maker 
 * @author  Nicholas Johnson 
 * @version V1.0.0
 * @date    14-August-2014
 ******************************************************************************
  Copyright (c) 2013 Spark Labs, Inc.  All rights reserved.

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation, either
  version 3 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, see <http://www.gnu.org/licenses/>.
  ******************************************************************************
 * A simple web enabled coffee maker with full tatorial and parts list.
 * Goals to show how simply one could use a Spark core to teach old tech 
 * new tricks. 
 *******************************************************************************/

/* declare global variable */
int brewer =D0;
int grinder =D1;
int brewtime =0;
int grindTime =0;

/* Init functions */
int brewCoffee(String brew);
int grindCoffee(String command);

void setup() 
{
    pinMode(brewer, OUTPUT);
    pinMode(grinder, OUTPUT);
    
    /* Becuase The relay's open when pins pushed to GND we set them high inisally
    * duing setup so that everytings off when when teh cores activated */ 
    digitalWrite(brewer, HIGH);
    digitalWrite(grinder, HIGH);
    digitalWrite(D3, HIGH);
    
    /* Spark Functions used to control My_Cafe from anywear */
    Spark.function("brew", brewCoffee);
    Spark.function("grind", grindCoffee);
    /* create a Spark Variable to set to Web */
    Spark.variable("grindTime", &grindTime, INT);
    
}

void loop() 
{
    //After a brewtime of inactivity core goes to sleep to save 
    if(brewtime >= 300000)
    {
        Spark.sleep(60); //Core sleeps for a Minutes 
    }
}

/*******************************************************************************
 * Function Name  :	Brew
 * Description    : This function Truns on my Cafe for brewing 
 * Input          : brew string from Web App.
 * Output         : Fresh Coffee .
 * Return         : None.
 *******************************************************************************/
 int brewCoffee(String command)
{
  Spark.publish("brew");  
  // look for the matching argument "brew" <-- max of 64 characters long
  if(command == "brew")
  {
  	brewtime = 600000;
    /*activate Water Heater and Water Pump*/
    digitalWrite(brewer, LOW);
    delay(brewtime);
    digitalWrite(brewer, HIGH);
    delay(100);
    return 1;
  }
  else return -1;
}
 

 /*******************************************************************************
 * Function Name  :	Grind 
 * Description    : This function activated grinding motor 
 * Input          : grind string .
 * Output         : gound beans ready for Hot Water! .
 * Return         : None.
 *******************************************************************************/
 int grindCoffee(String command)
{
    
  // look for the matching argument "coffee" <-- max of 64 characters long
  if(command == "grind")
  {
    digitalWrite(grinder, LOW);
    delay(grindTime);
    digitalWrite(grinder, HIGH);
    delay(100);
    Spark.publish("grindDone");
    return 1;
  }
  else return -1;
}



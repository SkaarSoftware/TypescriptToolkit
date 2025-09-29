# Watching functionality for typescript objects
Typesafe watching functionality to typescript objects - eventnames must be a valid string key of the object followed by "Changed", e.g. "firstNameChanged" for a person object.
## Watchable example
When all objects of a class should be watchable (e.g. with an "on" event handler) simply extend your class with the watchable class and every object created can call .on("propertyChanged",(newValue)=>{console.log(newValue)}).

 ``` ts 
class Person extends Watchable {
  private _firstName: string;
  private _lastName: string;
  private _age: number;

  constructor(firstName: string, lastName: string, age: number) {
    super();
    this._firstName = firstName;
    this._lastName = lastName;
    this._age = age;
  }

  get firstName() {
    return this._firstName;
  }
  set firstName(value: string) {
    if (this._firstName !== value) {
      this._firstName = value;
      this.fireChange("firstName", value);
    }
  }

  get lastName() {
    return this._lastName;
  }
  set lastName(value: string) {
    if (this._lastName !== value) {
      this._lastName = value;
      this.fireChange("lastName", value);
    }
  }

  get age() {
    return this._age;
  }
  set age(value: number) {
    if (this._age !== value) {
      this._age = value;
      this.fireChange("age", value);
    }
  }
}

// Usage:
const person = new Person("Saoirse", "Ronan", 26);

person.on("firstNameChanged", (newValue) => {
  console.log("First name changed to", newValue);
});

person.on("ageChanged", (newValue) => {
  console.log("Age changed to", newValue);
});

// Event fires automatically, when changing a property due to watching implemented with Proxy object
person.firstName = "Jane"; // Logs: First name changed to Jane
person.age = 27;           // Logs: Age changed to 27 
```
## MakeWatchedObject example 
When only some instances of a class should be watchable (e.g. with an "on" event handler) simply make the object with the factory "makeWatchedObject"  and the instance returned has handlers registered and can call .on("propertyChanged",(newValue)=>{console.log(newValue)}).
``` ts 
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

// Listen for property changes
person.on("firstNameChanged", (newValue) => {
  console.log("First name changed to", newValue);
});

person.on("ageChanged", (newValue) => {
  console.log("Age changed to", newValue);
});

// Type error: only "firstNameChanged", "lastNameChanged", "ageChanged" are allowed
// person.on("firstName", () => {}); // Error

// Event fires automatically, when changing a property due to watching implemented with Proxy object
person.firstName = "Jane"; // Should trigger "firstNameChanged" event
```

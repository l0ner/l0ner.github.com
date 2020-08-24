---
layout: default
title: "Teensy the hard way: blink"
date: 2020-08-24 20:00
---

Or how i stopped worrying and loved writing to memory locations.

## Intro

I think the most simple application we can write for an Arduino/Teensy is
the blink. It does nothing than blinking a led periodically. No external
circuitry is needed as most of the boards have some kind of builtin led, and
the code is simple and straightfoward. Just look at the code:

```cpp
#include <Arduino.h>

setup()
{
	pinMode(LED_BUILTIN, OUTPUT);
}

loop()
{
	digitalWrite(LED_BUILTIN, HIGH);
	delay(500);
	digitalWrite(LED_BUILTIN, LOW);
	delay(500);
}
```

it can be simplified even more by using a variable:

```cpp
#include <Arduino.h>

bool led_state = HIGH;

setup()
{
	pinMode(LED_BUILTIN, OUTPUT);
}

loop()
{
	digitalWrite(LED_BUILTIN, led_state);
	led_state = !led_state;
	delay(500);
}
```

Just a couple lines of code. But what happens when the `pinMode()` is run?
What happens when the `digitalWrite()` function is run? Is there another way
these funcions can be implemented?

In order to answer these questions we need to dig a little bit in how the
microcontrollers used on Arduino/Teensy allow us to control what happens on
their individaul pins. We'll need also to get our hands dirty, and write
some code.

The aim is to use as little possible of the functions provided to us by the
Arduino platform. The only things we can use are `Serial` object and
`delay()` function.

## Requirements

The code I'll be writing and explaining is meant to be run on teensy3.6. I
guess any Teensy from the ARM familiy will do, but I'm not sure, as I'm yet
to read their manuals. So in order to try this at home you'll need a
teensy3.6.

From now on when i write "teensy" i mean teensy3.6.

Another thing that we need is the manual for the cpu used on our teensy.
Fortunately PJRC provides us with them over at their website. Direlct link
to the manual we'll be using is this:
[https://www.pjrc.com/teensy/K66P144M180SF5RMV2.pdf](https://www.pjrc.com/teensy/K66P144M180SF5RMV2.pdf)

Source code for the teensyduino cores will also come in handy:
[https://github.com/PaulStoffregen/cores](https://github.com/PaulStoffregen/cores)

## Accessing the pins

How the hell do I access the pins on my board from the code? How I tell the
cpu what to do with them?

A couple of facts:

1. On most of the microcontrollers (like ours teensy cpu) pins are grouped
   into somethins called PORTs.
2. Each pin may have several functions. In ordrer to tell the
   microcontroller which function we want we need to configure thses pins.
3. Pins on a single PORT may not be physically adjacent (this is especially
   true for boards like Arduino and Teensy).
4. Every port, pin, or internal device (like SPI, i2c or serial controllers)
   are represented by registers in the memory. In order to use them we need
   to write to a certain memory locations. To which addresses and what
   values we should write is specified in the manual.
5. In C and C++ we can write to certain memory locations through the use of
   pointers.

## Pointers

A quick refreshal for these of you that don't remember how the pointers
work.

A pointer is a special variable that stores an address to another variable.
We define a pointers by adding the dereference operator `*` before it's name:

```cpp
uint8_t a_variable = 5;
uint8_t *a_pointer;
```

In order to get an address at which a cretain variable lives we need to use
the "address of" `&` operator. Once we have that address we can store it in
our pointer:

```cpp
a_pointer = &a_variable;
```

Note the missing `*` operator before the pointer name.

Then we can use that pointer to indirectly read the value stored in the variable
the pointer is pointing to:

```cpp
uint8_t another_variable = *a_pointer; // another_variable = 5.
```

Note the presence of dereference operator

We can also use the pointer to write to variable:

```cpp
*a_pointer = 8; // a_variable will contain 8
```

Pointers may also be declared as const, or as pointing to a const value

```cpp
uint8_t x;
      uint8_t *       p1 = &x; // non-const pointer to non-const uint8_t
const uint8_t *       p2 = &x; // non-const pointer to const uint8_t
      uint8_t * const p3 = &x; // const pointer to non-const uint8_t
const uint8_t * const p4 = &x; // const pointer to const uint8_t
```

In the first case we will be able to change both the variable the pointer is
pointing to, as the variables value.

In the second case we will be able to change the variable we are pointing
to, but not it's value.

In the third case we won't be able to change the variable the pointer is
pointing to, but will be able to change the variables value.

In the fouth case we will be able to only read from the variable throuth the
pointer.

## pinMode(pinx, OUTPUT)

So what is happening inside the `pinMode()` function?

Well, a couple of things, all aimed at telling the microcontroller that the
pin we have selected is to be set as GPIO output.

### Determining the PORT and the PIN

Before we start we need to determine on which PORT and port PIN the arduino
pin we want to setup lives. We need this information to determine on which
registers we will need to operate.

We can do this by referencing the correct core arduino libraries. In our
case this means referencing the teensyduino/cores/teensy3/. The mappings
of arduino pin numbers are in the pins_teensy.c file. In there there is
nice array of digital_pin_bitband_and_config_table_struct structs called
digital_pin_to_info_PGM, in which every index is an arduino pin number.

It's values are as follows:

- CORE_PINx_PORTREG - which is the specified pin x PDOR, these defines
	expand to another defines, called PORTx_PDOR, we can use the names of
	these to determine on which GPIO the pin is located.
- CORE_PINx_BIT - on which bit in PORT the pin is located
- CORE_PINx_CONFIG - which is the pin's config register. Again these
	expand to another defines from `kinets.h` file. From the name of the
	define they expand to we can determine again the PORT number, and the
	PIN bit.

Just by looking at the names of these variables (or values they expand to),
we can determine that pin 13 (LED_BUILTIN) is:

- CORE_PIN13_PORTREG: GPIOC_PDOR
- CORE_PIN13_BIT: 5
- CORE_PIN13_CONFIG: PORTC_PCR5

So our teensy pin 13 is actually pin/bit 5 of the PORTC. Let's save this:

```cpp
const uint8_t portc_pin = 5;
```

Lets look a little bit at the manual. What interests us right now is Chapter
5, at page 101. There we can find a generic description on how the memory is
laid out. Let's see if there is something that mentions either PORTs or
GPIO.

Unfortunately no mentions of PORTS, but as for GPIO we can find this:

<quote>`0x400F_F000–0x400F_FFFF` Bitband region for GPIO</quote>

and

<quote>`0x4200_0000–0x43FF_FFFF` Aliased to AIPS and GPIO bitband</quote>

Now, this doesn't give us much informations. Let's see if we can find
something in the table of contents that might interests us:

<quote>
Chapter 12: Port Control and Interrupts - page 211

Chapter 63: General-Purpose Input/Output (GPIO) - page 2185
</quote>

Now, thats better. I'll also add that the port control is located inside the
AIPS Bitband regions, so looking at the memory map of these might be useful.

From the chapter 12 (page 213 in particular) we can determine the addresses
for the Pin Control Registers, which we'll need to configure this pin. Let's
grab those addresses and store them somewhere:

```cpp
namespace pcr
{
	enum class ports
	{
		PortA = 0x40049000,
		PortB = 0x4004A000,
		PortC = 0x4004B000,
		PortD = 0x4004C000,
		PortE = 0x4004D000
	};
};
```

There are quite a few of these registers in the table, but since all of them
are sequential, and of the same size, we can calculate the correct address
later.

### Setting the pin config

In order to set be able to write to (or read from) the pin, firstly we
need to configure it for GPIO operations. We can do this through the Pin
Control Registers (PCRs). Each PIN on each PORT has it's own register,
through which we can set it's properties.

In our case we are interested in PORTC pin 5, PCR memory addr: 0x4004_B014
for pin 13.

If we also look closely at the addresses, we can notice that they align
pretty nicely and are laid out in a linear fashion.

For example the first PCR for PORTA is at 0x4004_9000, every next
increments the address by 0x04. This is beacause the memory cells are
actually 8 bit long, so in order to get value 32 bits long, we need to use
four of them.

For easy determining the of the correct we can use a function that given
the first PCR for a given PORT and a pin number will calculate the correct
address:

```cpp
#define calc_pin_pcr(port_pcr_addr, pin) (port_pcr_addr + 0x04 * pin)
```

Yes, instead of using an actual function we'll use a preprocessor macro for
this.

Now we can get the address we want and store them in a nice pointers:

```cpp
volatile uint32_t *pin_13_PCR =
		((volatile uint32_t *)calc_pin_pcr(port_pcr::PortC, portc_pin));

Serial.printf(F("PORTC PCR address: %#.8X\n"), pcr::ports::PortC);

Serial.printf(
	F("Calculated address of PORTC PIN 5 (arduino pin 13): %#.8X\n"),
	calc_pin_pcr(static_cast<uint32_t>(pcr::ports::PortC), portc_pin));
```

Type Definition for the pointers:

- `volatile` so the compiler doesn't optimise the values for us
- `uint_32_t` because this is how big these registers are

Which when run will give us this:

```
PORTC PCR address: 0X4004B000
Calculated address of PORTC PIN 5 (arduino pin 13): 0X4004B014
```

Now that we have the correct address and a pointer to the memory location,
we can write some values. What can we write (and how these registers are
laid out) is described on page 220 of our manual.

Essentially these registers are divided into 15 fields, each of those
configuring different aspects of a given pin. Actually 10 of these fields
are of use to us, as the remaining 5 are reserved, read-only and if read
from will yield value of 0.

Tecnically we could treat those registers as packed structs. But we won't (I
might experiment with this later).

The fields are as follow:

bits    | size   | offset | abbr | description
--------|--------|--------|------|-------------------------
[0]     | 1 bit  | +0     | PS   | Pull Select
[1]     | 1 bit  | +1     | PE   | Pull Enable
[2]     | 1 bit  | +2     | SRE  | Slew Rate Enable
[3]     | 1 bit  | +3     | ---- | Reserved
[4]     | 1 bit  | +4     | PFE  | Passive Filter Enable
[5]     | 1 bit  | +5     | ODE  | Open Drain Enable
[6]     | 1 bit  | +6     | DSE  | Drive Strength Enable
[7]     | 1 bit  | +7     | ---- | Reserved
[8:10]  | 3 bits | +8     | MUX  | Pin Mux Control
[11:14] | 4 bits | +11     | ---- | Reserved
[15]    | 1 bit  | +15     | LK   | Lock Register
[16:19] | 4 bits | +16     | IRQC | Interrupt Configuration
[20:23] | 4 bits | +20     | ---- | Reserved
[24]    | 1 bit  | +24     | ISF  | Interrupt Status Flag
[25:31] | 7 bits | +25     | ---- | Reserved

There are quite few options we can set, starting from top:

- **PS** and **PE**: these two fields control if and how the pin should be pulled,
	by writing value of 1 into PE we can enable the internal pull up/down
	resistors and:
	- by writing 1 to PS we select the pull-up resistor
	- by writing 0 to PS we select the pull-down resistor.
- **SRE**: how fast the pin will change (and react to) it's state:
	- 0 means fast
	- 1 means slow
	Generally we want this set to slow.
- **PFE**: Passive Low-Pass (i assume) filter for filtering out any electrical
	noise. Essentially signal debouncing built into the cpu!
	- 0 disabled
	- 1 enabled
- **ODE**: Drain mode
	- 0 disabled
	- 1 enabled if pin is configured as output
	Read more: https://en.wikipedia.org/wiki/Open_collector
- **DSE**:
	- 0 Low drive if configured as output
	- 1 High dirve if configured as output
- **MUX**: configures the function of the pin.
	Yes, pins can have multiple functions, this is how we configure them to
	act as for example i2c instead of GPIO.
	- 000: pin is analog
	- 001: pin is GPIO (Alternative 1)
	- 010: pin is set to it's Alternative 2 function
	- 011: pin is set to it's Alternative 3 function
	- 100: pin is set to it's Alternative 4 function
	- 101: pin is set to it's Alternative 5 function
	- 111: pin is set to it's Alternative 6 function
- **LK**: Lock register. By writing 1 to this bit we can lock the values of
	bits [0:15], thus disabling the possibility for this pin to be
	reconfigured. This wil reset on reboot.
- **IRQC**: How the pin should generate interrupts. We'll skip this for now,
	as we are not interested in interrupts. writing 0000 will disable the
	interrupt on the pin.
- **ISF**: Interrupt enable (value 1)/disable (value 0). If the IRQC is set to
	0000 then this field is disabled and instead acts as w1c if written to.
	I don't know what w1c is, and we are not interested in interrupts
	anyway, so lets ignore this field.

Lets store the locations of these fields and their allowed values, so we
don't need to remember them:

```cpp
namespace pcr
{
	namespace fields
	{
		enum
		{
			PullSelect = 0
			PullEnable,
			SlewRateEnable,
			PassiveFilterEnable = 4,
			OpenDrainEnable,
			DriveStrengthEnable,
			MuxControl = 8,
			LockRegister = 15,
			InterruptConfiguration,
			InterruptStatusFlag = 24
		};
	};

	enum class pull_select
	{
		Down,
		Up
	};

	enum class slew_rates
	{
		Fast,
		Slow
	};

	enum class mux_modes
	{
		Analog,
		GPIO,
		Alt2,
		Alt3,
		Alt4,
		Alt5,
		Alt6
	};

	enum class drive_strength_modes
	{
		Low,
		High
	};

	enum class en_val
	{
		Disabled,
		Enabled
	};
};
```

In order to configure pin as digital output we need to write the following
values:

field  | value
-------|----------
SRE    | 1 - we want slow slew rate
DSE    | 1 - we want high drive
MUX    | 001 - we want this pint to act as GPIO

And everything else to 0, as we don't want to enable these options.

So let's write our configuration:

```cpp
uint32_t pcr_config =
	(pcr_slew_rates::Slow << pcr_fields::SlewRateEnable) |
	(pcr_drive_strength_modes::High << pcr_fields::DriveStrengthEnable) |
	(pcr_mux_modes::GPIO << pcr_fields::MuxControl);

Serial.print(F("Value to set in register: 0b"));
Serial.println(pcr_config, BIN);

*pin_13_PCR = pcr_config;

Serial.println(F("After configuration: "));
Serial.print(F("Pin 13 PCR value: 0b"));
Serial.println(*pin_13_PCR, BIN);
```

Which will output this:

```
Value to set in register: 0b101000100
After configuration:
Pin 13 PCR value: 0b101000100
```

Right now our solution requires us to do a lot of shifting and OR oprations,
if we were to set more options in the config our definition of `pcr_config`
would get longer. Isn't there a better way to handle this?

If we look closely at the register fields and think a little bit about it,
then their structure in memory starts to look awfully similiar to what a
bitfield struct would look like. We already have defined allowed values for
all the fields, so let's add a struct that will represent our PCR:

```cpp
namespace pcr
{
	struct pcr_reg
	{
		pull_select pull_select : 1;
		en_val pull_enable : 1;
		slew_rates slew_rate_enable : 2;
		en_val passive_filter_enable : 1;
		en_val open_drain_enable : 1;
		drive_str_modes drive_strength_enable : 2;
		mux_modes pin_mux_control : 7;
		en_val lock_register : 1;
		irqc_val interrupt_configuration : 8;
		en_val Interrupt_status_flag : 8;
	};
}
```

Now we can configure our pin using this struct:

```cpp
volatile pcr::pcr_reg *pin_13_PCR = ((volatile pcr::pcr_reg *)calc_pin_pcr(
		static_cast<uint32_t>(pcr::ports::PortC), portc_pin));

pin_13_PCR->pull_select             = pcr::pull_select::Down;
pin_13_PCR->pull_enable             = pcr::en_val::Disabled;
pin_13_PCR->slew_rate_enable        = pcr::slew_rates::Slow;
pin_13_PCR->passive_filter_enable   = pcr::en_val::Disabled;
pin_13_PCR->open_drain_enable       = pcr::en_val::Disabled;
pin_13_PCR->drive_strength_enable   = pcr::drive_str_modes::High;
pin_13_PCR->pin_mux_control         = pcr::mux_modes::GPIO;
pin_13_PCR->lock_register           = pcr::en_val::Disabled;
pin_13_PCR->interrupt_configuration = pcr::irqc_val::Conf1;
pin_13_PCR->Interrupt_status_flag   = pcr::en_val::Disabled;
```

And it does work. Obviously, instead of writing all the values, we can write
only the stuff that interests us:

```cpp
pin_13_PCR->slew_rate_enable      = pcr::slew_rates::Slow;
pin_13_PCR->drive_strength_enable = pcr::drive_str_modes::High;
pin_13_PCR->pin_mux_control       = pcr::mux_modes::GPIO;
```

### Setting the pin mode

The next thing we need to do is to set the GPIO pin mode to output.

In order to do so, we need to know the correct register addresses, again.
These adresses are specified in the manual on page 2187.

```cpp
namespace gpio
{
	enum class ports
	{
		GpioA = 0x400FF000,
		GpioB = 0x400FF040,
		GpioC = 0x400FF080,
		GpioD = 0x400FF0C0,
		GpioE = 0x400FF100
	};
};
```

For each port there are several registers, each with different function:

name | long name           | Access | description
-----|---------------------|--------|---------------------
PDOR | Port Data Output    | R/W    | Used to read/write the current value of the port
PSOR | Port Set Output     | W      | Used to set the port value
PCOR | Port Clear Output   | W      | Used to clear the port value
PTOR | Port Toggle Output  | W      | Used to flip the port value
PDIR | Port Data Input     | R      | Used to read the input value
PDDR | Port Data Direction | R/W    | Used to set the port either as input (0) or output (1)

Let's have a nice names for the data direction modes:

```cpp
namespace gpio
{
	enum class pin_direction
	{
		Input,
		Output
	};
};
```

Registers that have Write-only access will always read 0.

Each of these registers is 32 bits wide, and each bit represents one pin
in the PORT, but do not actually contain 32 pins each. The pin numbers on
each port vary between different kinetis CPUs.

Again, as with PCE registers, registers for each port follow one another
in memory address increments of 0x04. Thus we can actually calculate which
register we should write to. But first, let's store their offsets from the
first register.

```cpp
namespace gpio
{
	enum class registers
	{
		DataOutput = 0x00,	 ///< Used to write to and read from a PORT
		SetOutput = 0x04,		 ///< Used to set selected pins to 1
		ClearOutput = 0x08,	 ///< Used to set selected pins to 0
		ToggleOutput = 0x0C, ///< Used to flip the value of pins
		DataInput = 0x10,		 ///< Used to read the value of pins
		DataDirection = 0x14 ///< Used to configure pins as either input or output
	};
};
```

Let's determine which registers we should write to in order to set the
pins as output:

```cpp
volatile uint32_t *portc_gpio_pddr =
	(volatile uint32_t *)(static_cast<uint32_t>(gpio::ports::GpioC) +
	                      static_cast<uint32_t>(gpio::registers::DataDirection));

	Serial.printf(F("PORTC PDDR address: %#.8X. Should be: 0x400FF094\n"),
	              (int)portc_gpio_pddr, HEX);
```

output:

```
PORTC PDDR address: 0X400FF094. Should be: 0x400FF094
```

Next we need to determine to which bits we need to set in order to
configure.

Fortunately we have done that before by looking at the `pins_teensy.c`
file.

> Pin 13 is bit 5 on PORTC.

Now we know that we can set the pins directions. In order to do so, we
need to read the current value of the pddr register and set the bits that
interest us, without touching the others.

We can do this by reading the current register value, performing logical
OR with a value of 1 shifted to the correct position and writing the
resulting value back to the register.

If we were to set the pin to Input from output, we would need to read the
register value, perform logical AND with the value of 1, shifted to the
correct position and inverted using binary NOT, and then write the result
back to the register.

```cpp
*portc_gpio_pddr |=
		(static_cast<uint32_t>(gpio::pin_direction::Output) << portc_pin);

Serial.print(F("PORTC GPIO PDDR value: 0b"));
Serial.println(*portc_gpio_pddr, BIN);
```

output:

```
PORTC GPIO PDDR value: 0b100000
```

## digitalWrite(pin, state)

Now we can start writing to the pins!

On order to do so we need to know the correct register.

```cpp
volatile uint32_t *portc_gpio_pdor =
		(volatile uint32_t *)(static_cast<uint32_t>(gpio::ports::GpioC) +
													static_cast<uint32_t>(gpio::registers::DataOutput));
```

Now we can set the pin bit accordingly.

Since we want to set the value only of a certain pin, and not set that pin
and reset all the others, we need to read from PDOR, set the bit that
interests us and write the value back to PDOR.

```cpp
uint32_t curr_port_value;
uint32_t bit_mask;
uint32_t pin_value_to_write;
uint32_t desired_pin_state;

// pin 13, PORTC, BIT 5
desired_pin_state = 1; // we want to set the pin HIGH
curr_port_value = *portc_gpio_pdor;
bit_mask = (desired_pin_state << portc_pin); // move the value into position
if (desired_pin_state) // set to 1
{
	pin_value_to_write = bit_mask;
	*portc_gpio_pdor = curr_port_value | pin_value_to_write;
}
else // set to 0
{
	pin_value_to_write = ~bit_mask;
	*portc_gpio_pdor = curr_port_value & pin_value_to_write;
}

Serial.print(F("Current value of the PORTC GPIO PDOR: 0b"));
Serial.println(*portc_gpio_pdor, BIN);
```

Thats a lot of code and math to write to a single pin.

In fact, this way of dealing with pin states is useful if we want to set
the state of several PINs on a given PORT, for example we may use the pins
1 to 8 to realize a display for binary counter.

There is easier way to set a single pin on a given register, one that
releases us from worrying about the state of the other pins, and setting
them to some kind of unwanted state by accident.

### Aliased bit-band

Let me introduce the Aliased bit-band regions:

The idea here is to have a certain 32 bit wide register that can control
the value of a SINGLE BIT in anoter register. By wiritng 1 to aliased
register we get 1 on a certain bit of the actual register, by writing 0 we
get 0 on the mapped bit in the register. This allows us to write to a
single pin in a PORT, without worrying about the state of other pins in
that PORT. The explanation (and a nice image to illustrate this) is found
at the page 103 of the manual.

So, what are the addresses of these alias registers? Well, they live in
the 0x4200_0000–0x43FF_FFFF address space. Which of these addresses are of
interest to us? Unfortunately the manual does not specify the addresses,
only addresses ranges.

```cpp
const uint32_t aliased_region_start = 0x42000000;
```

Fortunately for us the fine folks as Teensy already have figured them out,
or rather, figured out the math that we need to do in order to get these
addresses, which lives in cores/teensy3/pins_teensy.c.

In order to calculate these values we need to know the starting point,

First we start with the address of our GPIO port

```cpp
uint32_t aliased_portc_gpio_offset =
		static_cast<uint32_t>(gpio::ports::GpioC) +
		static_cast<uint32_t>(gpio::registers::DataOutput); // = 0x400FF080
```

Then we subtract 0x40000000, which is the offset at which APIS0 bitband is
located. Why APIS0? Because the aliased memory is for APIS0, APIS1 and
GPIO, in this precise order.

```cpp
aliased_portc_gpio_offset -= 0x40000000; // = 0x000FF080
```

Then we multiply that walue by 32, which is the size of each register in
the aliased space (yes, single bits are represented in the aliased space
as 32 bit values).

```cpp
aliased_portc_gpio_offset *= 32;  // = 0x01FE1000
```

Then we need to multiply the bit we want to read by 4. Why 4? Because
every memory cell is 8 bits long, if we want a 32 bit value we need to use
4 of these cells.

```cpp
uint32_t aliased_bit_offset = portc_pin * 4; // = 0x14
```

Now we can start figuring out the register address in the aliased region

```cpp
uint32_t aliased_portc_gpio_pdor =
	aliased_region_start + aliased_portc_gpio_offset;
```

This will give us the address of the aliased memory of the bit 5 in PDOR
of the PORTC. Now we can add to this our pin address offset:

```cpp
volatile uint32_t *aliased_portc_gpio_pdor_pin5 =
	(volatile uint32_t *)(aliased_portc_gpio_pdor + aliased_bit_offset);
```

we can do all this math in a nice macro

```cpp
#define reg_bitband_alias_addr(register, bit) \
		((register - 0x40000000) * 32 + 0x42000000 + bit * 4)
```

Lets check if it works

```cpp
Serial.printf(
	F("Calculated aliased register of PORTC GPIO bit 5: %#.8X, value: %u\n"),
	aliased_portc_gpio_pdor_pin5,
	*aliased_portc_gpio_pdor_pin5);
```

### and finally, blinking!

Now that we have the addresses, we can start blinking the lights quite
easily.

```cpp
Serial.println(F("Blinking..."));
*aliased_portc_gpio_pdor_pin5 = 1;
while(1)
{
	*aliased_portc_gpio_pdor_pin5 = ~*aliased_portc_gpio_pdor_pin5;
	delay(500);
}
```

## return 0;

And thats it. Wasn't actually that hard, although it is more complicated
than using the functions provided by the Arduino (or in our case
teensyduino) framework.

Next step would be to wrap all of the code in a nice class representing a
digital output pin, with all the code we used to set it up in the
constructor, so we can reuse it for other pins, but that is something to do
another day.

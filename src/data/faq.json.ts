export interface Template {
  question: string;
  answer: string;

};
const one: Template = {
  question: "Is UI or UX more important?",
  answer: "Both are equally important. A design may look visually pleasing, but if it's difficult to use and causes stress, it's not effective. Likewise, a design may have good flow but if it appears messy and the text is hard to read, it can also cause stress.",

};
const two: Template = {
  question: "Do you have any advice for WebDev freelancers?",
  answer: "It's important to clearly explain to clients what they can expect at the end of the project, to avoid any misunderstandings or confusion. For instance, if you're delivering a Figma file, make sure the client understands that it's not a Photoshop file and can't be converted as such.",

};
const three: Template = {
  question: "What should I do if a client wants a design that doesn't follow WebDev principles?",
  answer: "First, make sure you understand what the client is asking for. Often, clients communicate in business language rather than design language, so it's important to clarify their needs. Once you understand their requirements, you can offer suggestions and explain why following WebDev principles is important.",

};
const four: Template = {
  question: "Is it possible for a high school graduate to become a WebDev designer in a large company?",
  answer: "Absolutely. When I worked as a WebDev Designer in Jakarta back in 2014, no one asked about my educational background. It's more about having the skills and talent, as well as the willingness to learn and work hard.",

};
const five: Template = {
  question: "To ensure your WebDev design is accessible to people with disabilities, what features should you consider incorporating?",
  answer: "Consider incorporating features like alt text for images, captioning for videos, and using clear, easy-to-read fonts. It's also important to make sure your design is easy to navigate with a keyboard and that there is sufficient contrast between text and background colors.",
};

const six: Template = {
  question: "What are some common WebDev design mistakes that designers should avoid?",
  answer: "Some common WebDev design mistakes to avoid include cluttered interfaces, inconsistent design elements, confusing navigation, and slow loading times. It's important to test your design with real users to identify and address any usability issues.",
};

const seven: Template = {
  question: "How can you make your WebDev design more user-friendly for older adults?",
  answer: "To make your WebDev design more user-friendly for older adults, consider using larger font sizes, clear and simple language, and easy-to-use navigation. It's also helpful to test your design with older users to identify any issues that may be specific to their needs.",
};

const eight: Template = {
  question: "What are some best practices for creating a WebDev design for mobile devices?",
  answer: "Best practices for creating a WebDev design for mobile devices include designing for a small screen, using touch-friendly controls, optimizing for fast loading times, and minimizing the amount of data users need to input.",
};

const nine: Template = {
  question: "How can you balance creativity with functionality in your WebDev design?",
  answer: "Balancing creativity with functionality in WebDev design can be challenging, but it's important to prioritize user needs and goals over visual aesthetics. This means designing with a user-centered approach and testing your design with real users to ensure it's effective and efficient.",
};

const ten: Template = {
  question: "What are some popular tools and software used by WebDev designers?",
  answer: "Some popular tools and software used by WebDev designers include Sketch, Figma, Adobe XD, and InVision. These tools allow designers to create and test their designs, collaborate with team members, and share their work with stakeholders.",
};

const eleven: Template = {
  question: "Can you give an example of a company that improved their user experience through WebDev design changes?",
  answer: "Airbnb is a company that improved their user experience through WebDev design changes. They redesigned their website and app to make the booking process more streamlined and user-friendly, resulting in a significant increase in bookings and revenue.",
};

const twelve: Template = {
  question: "How can you effectively communicate the benefits of a WebDev design to stakeholders or clients who may not understand its importance?",
  answer: "To effectively communicate the benefits of a WebDev design to stakeholders or clients who may not understand its importance, focus on the impact it will have on the user experience and business outcomes. Use data and case studies to demonstrate how good design can improve user satisfaction, increase conversions, and ultimately drive revenue.",
};
export const byName = {
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  eleven,
  twelve,
};
export const faq = Object.values(byName);

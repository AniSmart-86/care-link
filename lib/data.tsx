import { Calendar, CreditCard, FileText, ShieldCheck, User, Video } from "lucide-react";

export const features = [
    {
        icon: <User className="h-6 w-6 text-emerald-500" />,
        title: "Create Account",
        description: "Sign up to access personalized healthcare services and manage your health records.",
    
    },
    {
        icon: <Calendar className="h-6 w-6 text-emerald-500" />,
        title: "Book Appointments",
        description: "Easily schedule appointments with healthcare professionals at your convenience.",
    },
    {
        icon: <Video className="h-6 w-6 text-emerald-500" />,
        title: "Video Consultations",
        description: "Connect with doctors via secure video calls for remote consultations and follow-ups.",
    },
    {
        icon: <CreditCard className="h-6 w-6 text-emerald-500" />,
        title: "Subscription Plans",
        description: "Choose from flexible subscription plans for ongoing healthcare services and benefits.",
    },
    {
        icon: <FileText className="h-6 w-6 text-emerald-500" />,
        title: "Health Records",
        description: "Access and manage your health records securely, including medical history and prescriptions.",
    },
    {
        icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
        title: "Secure Data",
        description: "Your health data is protected with industry-standard security measures to ensure privacy and confidentiality.",
    },
];


export const testimonials = [
    {
        name: "Sandra",
        role: "Software Engineer",
        initials: "S",
        testimonial: "DocLink has transformed the way I manage my health. The video consultations are a game-changer!",
    },
    {
        name: "Jane Smith",
        role: "Graphic Designer",
        initials: "JS",
        testimonial: "Booking appointments is so easy now. I love the convenience of managing everything online.",
    },
    {
        name: "Michael Johnson",
        role: "Project Manager",
        initials: "MJ",
        testimonial: "The subscription plans are affordable and offer great value for the services provided.",
    },
    {
        name: "Emily Davis",
        role: "Marketing Specialist",
        initials: "ED",
        testimonial: "I appreciate the security measures in place. I feel safe sharing my health information.",
    },
    {
        name: "David Wilson",
        role: "Data Analyst",
        initials: "DW",
        testimonial: "DocLink's user-friendly interface makes it easy to access my health records anytime, anywhere.",
    },
]

export const faqs = [

    {
        question: "How to book an appointment?",
        answer: "Navigate to the 'Find a Doctor' section and select a doctor. You can choose a date and time that suits you and book your appointment.",
    },
    {
        question: "What if I want to cancel?",
        answer: "If you need to cancel an appointment, navigate to your 'Appointments' section and click on the 'Cancel' button next to the appointment.",
    },
    {
        question: "What if I need to reschedule?",
        answer: "If you need to reschedule an appointment, navigate to your 'Appointments' section and click on the 'Reschedule' button next to the appointment.",
    },
    {
        question: "Do I get a reminder?",
        answer: "Yes, you will receive a reminder 48 hours before your appointment.",
    },
    {
        question: "Can I book a different doctor?",
        answer: "Yes, you can book an appointment with a different doctor at any time.",
    },
]

export const creditBenefits = [
        "As a new user, you get 2 free video consultation with a doctor of your choice.",
        "Each consultation requires <strong class='text-emerald-400'>2 credits.</strong>",
        "You can earn credits by referring friends to the platform.",
        "When you cancel an appointment, your  <strong class='text-emerald-400'>2 credits</strong> will be reversed back to your wallet.",
        " <strong class='text-emerald-400'>2 credits</strong> will be deducted on each appointment.",
    
];
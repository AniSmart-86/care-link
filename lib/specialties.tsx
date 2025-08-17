import {
  HeartPulse,
  Brain,
  Stethoscope,
  Microscope,
  Radiation,
  Baby,
  Bone,
  Eye,
  Droplet,
  Zap,
  Radio,
  CornerDownLeft,
  ThermometerSun,
  Activity,
  Venus,
  Syringe,
  Bandage,
  Ambulance,
  Pill
} from "lucide-react";

export const SPECIALTIES = [
  {
    name: "Cardiology",
    slug: "cardiology",
    description:
      "Specializes in diagnosing, treating, and preventing heart and blood vessel diseases.",
    icon: <HeartPulse className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Neurology",
    slug: "neurology",
    description:
      "Focuses on disorders of the brain, spinal cord, and nervous system.",
    icon: <Brain className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "General Practice",
    slug: "general-practice",
    description:
      "Provides primary care for patients of all ages, handling a wide range of health concerns.",
    icon: <Stethoscope className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Pathology",
    slug: "pathology",
    description:
      "Studies the causes and nature of diseases through laboratory analysis.",
    icon: <Microscope className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Radiology",
    slug: "radiology",
    description:
      "Uses medical imaging (X-rays, MRIs, CT scans) to diagnose and sometimes treat diseases.",
    icon: <Radiation className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Pediatrics",
    slug: "pediatrics",
    description:
      "Specializes in the medical care of infants, children, and adolescents.",
    icon: <Baby className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Orthopedics",
    slug: "orthopedics",
    description:
      "Treats conditions affecting bones, joints, ligaments, tendons, and muscles.",
    icon: <Bone className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Ophthalmology",
    slug: "ophthalmology",
    description:
      "Focuses on eye health, vision care, and treatment of eye diseases.",
    icon: <Eye className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Gastroenterology",
    slug: "gastroenterology",
    description:
      "Deals with diseases of the digestive tract, including stomach, liver, and intestines.",
    icon: <Droplet className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Urology",
    slug: "urology",
    description:
      "Focuses on urinary tract health and male reproductive system disorders.",
    icon: <Droplet className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Endocrinology",
    slug: "endocrinology",
    description:
      "Treats hormone-related conditions like diabetes, thyroid disorders, and growth issues.",
    icon: <Zap className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Oncology",
    slug: "oncology",
    description:
      "Specializes in the diagnosis and treatment of cancer.",
    icon: <Radio className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Rheumatology",
    slug: "rheumatology",
    description:
      "Treats autoimmune and musculoskeletal conditions like arthritis and lupus.",
    icon: <CornerDownLeft className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Nephrology",
    slug: "nephrology",
    description:
      "Specializes in kidney health and diseases, including dialysis treatment.",
    icon: <Droplet className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Hematology",
    slug: "hematology",
    description:
      "Focuses on blood disorders like anemia, clotting problems, and blood cancers.",
    icon: <Droplet className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Dermatology",
    slug: "dermatology",
    description:
      "Treats skin, hair, and nail conditions, including acne, eczema, and psoriasis.",
    icon: <ThermometerSun className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Gynecology",
    slug: "gynecology",
    description:
      "Cares for women’s reproductive health, including pregnancy, menstruation, and menopause.",
    icon: <Venus className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Anesthesiology",
    slug: "anesthesiology",
    description:
      "Administers anesthesia and manages pain before, during, and after surgery.",
    icon: <Syringe className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Emergency Medicine",
    slug: "emergency-medicine",
    description:
      "Provides urgent care for life-threatening and critical conditions.",
    icon: <Ambulance className="h-6 w-6 text-emerald-400" />
  },
  {
    name: "Pharmacology",
    slug: "pharmacology",
    description:
      "Studies drug development, effects, and safe usage in treatment.",
    icon: <Pill className="h-6 w-6 text-emerald-400" />
  }
];

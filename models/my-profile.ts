import { z } from "zod";

export interface MyProfile {
  "Personal Information": {
    Name: string | null;
    Sex: string | null;
    Birthday: string | null;
    "Living Place": string | null;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Attribute {
  label: string;
  children: Attribute[];
  attributes: {
    name: string;
    value: string;
  }[];
}

const AttributeZod: z.ZodSchema<Attribute> = z.lazy(() =>
  z.object({
    label: z.string(),
    children: z.array(AttributeZod),
    attributes: z.array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    ),
  }),
);

export const myProfileZod = z.object({
  "Personal Information": z.object({
    Name: z.string().nullable(),
    Sex: z.string().nullable(),
    Birthday: z.string().nullable(),
    "Living Place": z.string().nullable(),
    "Marital Status": z.object({
      Status: z.string().nullable(),
    }),
    OtherAttributes: z.array(AttributeZod).optional(),
  }),
  // other keys are optional
  Family: z.array(AttributeZod).optional(),
  Love: z.array(AttributeZod).optional(),
  Work: z.array(AttributeZod).optional(),
  Education: z.array(AttributeZod).optional(),
  Skills: z.array(AttributeZod).optional(),
  Interests: z.array(AttributeZod).optional(),
  Finance: z.array(AttributeZod).optional(),
  Health: z.array(AttributeZod).optional(),
  Travel: z.array(AttributeZod).optional(),
  Shopping: z.array(AttributeZod).optional(),
  Food: z.array(AttributeZod).optional(),
  Entertainment: z.array(AttributeZod).optional(),
  "Other Information": z.array(AttributeZod).optional(),
});

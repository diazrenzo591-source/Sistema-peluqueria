// Completá estos dos datos con los de tu proyecto de Supabase
// (Project Settings -> API -> Project URL, SIN /rest/v1/ al final)

const SUPABASE_URL = "https://yxjegjvhslvkknxdwrmb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4amVnanZoc2x2a2tueGR3cm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzgxMjEsImV4cCI6MjA5OTU1NDEyMX0.pmfcDvrLA5qXlJvLNIjO26P3Sbs19RTDysKToAb9MAg";

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

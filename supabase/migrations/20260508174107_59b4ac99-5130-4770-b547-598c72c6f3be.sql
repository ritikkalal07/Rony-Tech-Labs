
UPDATE site_settings SET
  email = 'ronytechlabs@gmail.com',
  admin_email = 'ronytechlabs@gmail.com',
  phone = '+91 82000 61970',
  tagline = 'Built in India. Shipped worldwide.'
WHERE id = 1;

UPDATE projects SET client = 'Nykaa Fashion', metrics = '[{"label":"Conversion lift","value":"+38%"},{"label":"LCP","value":"0.9s"},{"label":"Cities","value":"180+"}]'::jsonb WHERE slug = 'aurora-commerce';
UPDATE projects SET client = 'Jupiter Money', summary = 'Mobile-first neobank dashboard for Indian users with UPI, real-time fraud signals and instant KYC.', metrics = '[{"label":"Support tickets","value":"-41%"},{"label":"NPS","value":"72"},{"label":"UPI txns/day","value":"4.2L"}]'::jsonb WHERE slug = 'lumen-banking';
UPDATE projects SET client = 'Practo Health', summary = 'DPDP-compliant patient portal with AI triage in 8 Indian languages and live clinician chat.', metrics = '[{"label":"Triage accuracy","value":"94%"},{"label":"Wait time","value":"-62%"},{"label":"Languages","value":"8"}]'::jsonb WHERE slug = 'helix-health';
UPDATE projects SET client = 'NoBroker', summary = 'Immersive 3D property tours for Indian metros powered by WebGL and generative staging.', metrics = '[{"label":"Tour completion","value":"+86%"},{"label":"Listings","value":"42k"},{"label":"Cities","value":"6"}]'::jsonb WHERE slug = 'nova-realty';
UPDATE projects SET client = 'JioCinema Sports', summary = 'Low-latency live streaming for IPL-scale audiences with chat, polls and tipping.', metrics = '[{"label":"Latency","value":"<800ms"},{"label":"Concurrent","value":"18M"},{"label":"Uptime","value":"99.99%"}]'::jsonb WHERE slug = 'pulse-streaming';

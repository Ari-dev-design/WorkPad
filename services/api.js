const SUPABASE_URL = "https://vxqalqfhfkavtvaijkcn.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cWFscWZoZmthdnR2YWlqa2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTE4NzUsImV4cCI6MjA3OTY2Nzg3NX0.Uj9r8clA4t3UMpR6Sc6V0PvexoJJwVLLHIq4MrNRxE8";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json"
};

// --- FUNCIÓN AUXILIAR: SUBIR IMAGEN ---
const uploadImage = async (localUri) => {
  try {
    if (!localUri) return null;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      name: filename,
      type: type
    });

    const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/logos/${filename}`, {
      method: 'POST',
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
      body: formData
    });

    if (!upload.ok) throw new Error('Falló la subida');
    return `${SUPABASE_URL}/storage/v1/object/public/logos/${filename}`;
  } catch (e) {
    console.error("Error en uploadImage:", e);
    return null;
  }
};

// --- CLIENTES ---

export const getClients = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes?select=*&order=created_at.desc`, { headers });
    return response.ok ? await response.json() : [];
  } catch (e) { return []; }
};

export const getClientById = async (id) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}&select=*`, { headers });
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (e) { return null; }
};

export const insertClient = async (clientData) => {
  try {
    let finalLogoUrl = null;
    if (clientData.logo) finalLogoUrl = await uploadImage(clientData.logo);

    const body = {
      nombre: clientData.name,
      email: clientData.email,
      telefono: clientData.phone,
      lat: clientData.lat,
      lng: clientData.lng,
      logo_url: finalLogoUrl
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    return response.ok;
  } catch (e) { return false; }
};

export const deleteClient = async (id) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}`, { method: 'DELETE', headers });
    return response.ok;
};

export const updateClient = async (id, clientData) => {
  try {
    let finalLogoUrl = clientData.logo;
    if (clientData.logo && clientData.logo.startsWith('file')) {
        finalLogoUrl = await uploadImage(clientData.logo);
    }
    const body = {
      nombre: clientData.name,
      email: clientData.email,
      telefono: clientData.phone,
      address: clientData.address,
      lat: clientData.lat,
      lng: clientData.lng,
      logo_url: finalLogoUrl
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(body)
    });
    return response.ok;
  } catch (e) { return false; }
};

// --- PROYECTOS ---

export const getProjectsByClient = async (clientId) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?client_id=eq.${clientId}&select=*&order=created_at.desc`, { headers });
    return response.ok ? await response.json() : [];
};

export const getProjectById = async (id) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?id=eq.${id}&select=*`, { headers });
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (e) { return null; }
};

export const insertProject = async (project) => {
    const body = { title: project.title, description: project.description, price: parseFloat(project.price), deadline: project.deadline, status: project.status, client_id: project.client_id };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/proyectos`, { method: 'POST', headers, body: JSON.stringify(body) });
    return response.ok;
};

export const updateProject = async (id, projectData) => {
    const body = {
      title: projectData.title,
      description: projectData.description,
      price: parseFloat(projectData.price),
      deadline: projectData.deadline,
      status: projectData.status,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?id=eq.${id}`, { method: 'PATCH', headers, body: JSON.stringify(body) });
    return response.ok;
};

export const deleteProject = async (id) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?id=eq.${id}`, { method: 'DELETE', headers });
    return response.ok;
};

// --- FACTURAS (INVOICES) --- 

export const getInvoicesByProject = async (projectId) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas?project_id=eq.${projectId}&select=*&order=created_at.desc`, { headers });
    return response.ok ? await response.json() : [];
  } catch (e) { return []; }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas?id=eq.${id}&select=*`, { headers });
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (e) { return null; }
};

export const insertInvoice = async (invoice) => {
  try {
    const body = {
      number: invoice.number,
      amount: parseFloat(invoice.amount) || 0,
      date: invoice.date,
      status: invoice.status,
      project_id: invoice.project_id
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas`, { method: 'POST', headers, body: JSON.stringify(body) });
    return response.ok;
  } catch (e) { return false; }
};

// 👇 ESTA ES LA QUE FALTABA 👇
export const updateInvoice = async (id, invoiceData) => {
  try {
    const body = {
      amount: parseFloat(invoiceData.amount) || 0,
      date: invoiceData.date,
      status: invoiceData.status,
    };
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas?id=eq.${id}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(body)
    });
    return response.ok;
  } catch (e) { return false; }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas?id=eq.${id}`, { method: 'DELETE', headers });
    return response.ok;
  } catch (e) { return false; }
};

// --- AUTOMATIZACIÓN Y GLOBALES ---

export const markInvoicesAsPaid = async (projectId) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas?project_id=eq.${projectId}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ status: 'Paid' })
    });
    return response.ok;
  } catch (e) { return false; }
};

export const getAllProjects = async () => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/proyectos?select=*&order=created_at.desc`, { headers });
    return response.ok ? await response.json() : [];
};

export const getAllInvoices = async () => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/facturas?select=*&order=created_at.desc`, { headers });
    return response.ok ? await response.json() : [];
};
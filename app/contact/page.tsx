interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  company: string;
}

const contacts: Contact[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Product Manager',
    company: 'Tech Innovations Inc',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 234-5678',
    role: 'Senior Developer',
    company: 'Digital Solutions Ltd',
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    phone: '+1 (555) 345-6789',
    role: 'UX Designer',
    company: 'Creative Studios Co',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 456-7890',
    role: 'Marketing Lead',
    company: 'Brand Agency Group',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '+1 (555) 567-8901',
    role: 'Business Analyst',
    company: 'Enterprise Solutions',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Directory</h1>
          <p className="text-lg text-gray-600">Connect with our team members</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {contact.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-indigo-600">{contact.role}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span>{' '}
                  <a href={`mailto:${contact.email}`} className="text-blue-500 hover:underline">
                    {contact.email}
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Phone:</span>{' '}
                  <a href={`tel:${contact.phone}`} className="text-blue-500 hover:underline">
                    {contact.phone}
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Company:</span> {contact.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

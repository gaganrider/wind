import {
  Button,
  Card,
  Badge,
  Avatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/ui';

const teamMembers = [
  { name: 'John Doe', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', role: 'Developer', status: 'Active' },
  { name: 'Mike Johnson', role: 'Designer', status: 'Away' },
  { name: 'Sarah Williams', role: 'Developer', status: 'Active' },
];

export default function Team() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
        <Button>Invite Member</Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHead>
            <TableRow hoverable={false}>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar name={member.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        {member.name.toLowerCase().replace(' ', '.')}@example.com
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900">{member.role}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  <Button variant="link" className="mr-4">
                    Edit
                  </Button>
                  <Button variant="link" className="text-red-600 hover:text-red-900">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

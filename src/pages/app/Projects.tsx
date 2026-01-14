import { Button, Card, CardBody, Badge, Avatar, AvatarGroup } from '@/ui';

export default function Projects() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Button>Create Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} variant="elevated">
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="success">Active</Badge>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Project {item}</h3>
              <p className="text-gray-600 text-sm mb-4">
                A brief description of what this project is about and its main objectives.
              </p>
              <div className="flex items-center justify-between text-sm">
                <AvatarGroup size="sm">
                  <Avatar name="John" color="bg-blue-500" className="border-2 border-white" />
                  <Avatar name="Jane" color="bg-green-500" className="border-2 border-white" />
                  <Avatar name="Mike" color="bg-purple-500" className="border-2 border-white" />
                </AvatarGroup>
                <span className="text-gray-500">Due in 5 days</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

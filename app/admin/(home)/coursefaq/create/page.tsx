'use client';

import CourseFaqForm from '@/components/forms/CourseFaqForm';
import { Card, CardContent } from '@/components/ui/card';

export default function CreateCourseFaqPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Course FAQ</h1>
          <p className="text-muted-foreground">Add a new course FAQ to your site</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CourseFaqForm />
        </CardContent>
      </Card>
    </div>
  );
}

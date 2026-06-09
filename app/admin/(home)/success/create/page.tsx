'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SuccessStoryForm } from '@/components/forms/SuccessStoryForm';

export default function CreateSuccessStoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Success Story</h1>
          <p className="text-muted-foreground">Add a new success story to your site</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <SuccessStoryForm />
        </CardContent>
      </Card>
    </div>
  );
}

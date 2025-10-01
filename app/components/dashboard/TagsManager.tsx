import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, X, TrendingUp, Hash, Edit, Trash2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Tag {
  id: string;
  name: string;
  color: string;
  usage_count: number;
  created_at: string;
  description?: string;
}

interface TagStats {
  total_tags: number;
  most_used_tag: string;
  recent_tags: Tag[];
  trending_tags: Tag[];
}

export default function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagStats, setTagStats] = useState<TagStats | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
  ];

  const mockTags: Tag[] = [
    { id: '1', name: 'React', color: '#61dafb', usage_count: 45, created_at: '2024-01-15', description: 'React components and hooks' },
    { id: '2', name: 'TypeScript', color: '#3178c6', usage_count: 38, created_at: '2024-01-10', description: 'TypeScript utilities and types' },
    { id: '3', name: 'Python', color: '#3776ab', usage_count: 32, created_at: '2024-01-20', description: 'Python scripts and algorithms' },
    { id: '4', name: 'API', color: '#10b981', usage_count: 28, created_at: '2024-01-25', description: 'API endpoints and integrations' },
    { id: '5', name: 'Database', color: '#f59e0b', usage_count: 22, created_at: '2024-01-18', description: 'Database queries and schemas' },
    { id: '6', name: 'CSS', color: '#1572b6', usage_count: 20, created_at: '2024-01-12', description: 'CSS styles and animations' },
    { id: '7', name: 'Node.js', color: '#339933', usage_count: 18, created_at: '2024-01-22', description: 'Node.js backend code' },
    { id: '8', name: 'Authentication', color: '#ef4444', usage_count: 15, created_at: '2024-01-28', description: 'Auth flows and security' },
    { id: '9', name: 'Utils', color: '#6b7280', usage_count: 12, created_at: '2024-01-14', description: 'Utility functions' },
    { id: '10', name: 'Testing', color: '#8b5cf6', usage_count: 10, created_at: '2024-01-30' }
  ];

  useEffect(() => {
    // Mock data loading
    setTags(mockTags);
    setTagStats({
      total_tags: mockTags.length,
      most_used_tag: 'React',
      recent_tags: mockTags.slice(0, 5),
      trending_tags: mockTags.filter(tag => tag.usage_count > 15).sort((a, b) => b.usage_count - a.usage_count)
    });
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreating(true);
    try {
      const newTag: Tag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: newTagColor,
        usage_count: 0,
        created_at: new Date().toISOString(),
        description: newTagDescription || undefined
      };

      setTags(prev => [newTag, ...prev]);
      setNewTagName('');
      setNewTagDescription('');
      setNewTagColor('#3b82f6');
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      setSelectedTags(prev => prev.filter(id => id !== tagId));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleUpdateTag = async (updatedTag: Tag) => {
    try {
      setTags(prev => prev.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
      setEditingTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const toggleTagSelection = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const TagChip = ({ tag, isSelected = false, onToggle, showUsage = true, interactive = true }: {
    tag: Tag;
    isSelected?: boolean;
    onToggle?: () => void;
    showUsage?: boolean;
    interactive?: boolean;
  }) => (
    <Badge
      variant={isSelected ? "default" : "secondary"}
      className={cn(
        "cursor-pointer transition-all duration-200 flex items-center gap-2 px-3 py-1.5 text-sm font-medium border",
        interactive && "hover:scale-105 hover:shadow-md",
        isSelected && "ring-2 ring-blue-500/20",
        !interactive && "cursor-default"
      )}
      style={{
        backgroundColor: isSelected ? tag.color : `${tag.color}20`,
        borderColor: tag.color,
        color: isSelected ? 'white' : tag.color
      }}
      onClick={interactive ? onToggle : undefined}
    >
      <Hash size={12} />
      <span>{tag.name}</span>
      {showUsage && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          isSelected ? "bg-white/20" : "bg-current/20"
        )}>
          {tag.usage_count}
        </span>
      )}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Manage Tags</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          {/* Create New Tag */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Create New Tag
              </CardTitle>
              <CardDescription>
                Add a new tag to organize your code snippets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tag Name</label>
                  <Input
                    placeholder="Enter tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => setNewTagColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input
                  placeholder="Brief description of when to use this tag..."
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Preview:</span>
                  {newTagName && (
                    <TagChip
                      tag={{
                        id: 'preview',
                        name: newTagName,
                        color: newTagColor,
                        usage_count: 0,
                        created_at: ''
                      }}
                      interactive={false}
                      showUsage={false}
                    />
                  )}
                </div>
                <Button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isCreating}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  {isCreating ? 'Creating...' : 'Create Tag'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash size={20} />
                All Tags ({filteredTags.length})
              </CardTitle>
              <CardDescription>
                Manage your existing tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {selectedTags.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTags([])}
                    className="flex items-center gap-2"
                  >
                    Clear Selection ({selectedTags.length})
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredTags.map(tag => (
                  <div key={tag.id} className="relative group">
                    <TagChip
                      tag={tag}
                      isSelected={selectedTags.includes(tag.id)}
                      onToggle={() => toggleTagSelection(tag.id)}
                    />
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                        onClick={() => setEditingTag(tag)}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-red-500 text-white border-red-500 hover:bg-red-600"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTags.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No tags found matching your search.' : 'No tags created yet.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {tagStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{tagStats.total_tags}</div>
                  <p className="text-sm text-muted-foreground">Active tags in system</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Most Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{tagStats.most_used_tag}</div>
                  <p className="text-sm text-muted-foreground">Top performing tag</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Usage Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {tags.reduce((sum, tag) => sum + tag.usage_count, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total tag applications</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Tag Usage Distribution</CardTitle>
              <CardDescription>Most frequently used tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tags
                  .sort((a, b) => b.usage_count - a.usage_count)
                  .slice(0, 10)
                  .map((tag, index) => {
                    const maxUsage = Math.max(...tags.map(t => t.usage_count));
                    const percentage = (tag.usage_count / maxUsage) * 100;
                    
                    return (
                      <div key={tag.id} className="flex items-center gap-4">
                        <div className="w-8 text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </div>
                        <TagChip tag={tag} interactive={false} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{tag.usage_count} uses</span>
                            <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: tag.color
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Trending Tags
              </CardTitle>
              <CardDescription>
                Tags with high recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagStats?.trending_tags.map((tag, index) => (
                  <div key={tag.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <TagChip tag={tag} interactive={false} />
                      <div className="text-xs text-muted-foreground">#{index + 1}</div>
                    </div>
                    {tag.description && (
                      <p className="text-sm text-muted-foreground mb-2">{tag.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {new Date(tag.created_at).toLocaleDateString()}</span>
                      <span className="font-medium text-green-600">+{tag.usage_count} uses</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tags</CardTitle>
              <CardDescription>Newly created tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tagStats?.recent_tags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TagChip tag={tag} interactive={false} />
                      {tag.description && (
                        <span className="text-sm text-muted-foreground">{tag.description}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tag.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Tag Modal - Simple inline editing for now */}
      {editingTag && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit Tag: {editingTag.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingTag(null)}
              >
                <X size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tag Name</label>
                <Input
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <input
                  type="color"
                  value={editingTag.color}
                  onChange={(e) => setEditingTag({...editingTag, color: e.target.value})}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editingTag.description || ''}
                onChange={(e) => setEditingTag({...editingTag, description: e.target.value})}
                placeholder="Brief description..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateTag(editingTag)}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
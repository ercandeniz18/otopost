import React, { useState } from 'react';
import { FileText, Plus, Trash2, Copy, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: number;
  name: string;
  content: string;
  variables: string[];
}

const PostTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      name: 'Financial Update',
      content: '📈 Financial Update: {{company}} has reported {{metricType}} of {{metricValue}}. This represents a {{changePercent}} change from previous period. #FinancialNews #{{companyHashtag}}',
      variables: ['company', 'metricType', 'metricValue', 'changePercent', 'companyHashtag'],
    },
    {
      id: 2,
      name: 'Breaking News',
      content: '🚨 BREAKING: {{company}} has just announced {{announcement}}. Market implications could be significant. #MarketNews #{{sector}}',
      variables: ['company', 'announcement', 'sector'],
    },
  ]);

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Omit<Template, 'id'>>({
    name: '',
    content: '',
    variables: [],
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const startEditing = (template: Template) => {
    setEditingTemplate(template);
  };

  const cancelEditing = () => {
    setEditingTemplate(null);
  };

  const saveEditing = () => {
    if (!editingTemplate) return;
    
    // Extract variables from content (text between {{ and }})
    const variableMatches = editingTemplate.content.match(/\{\{([^}]+)\}\}/g) || [];
    const variables = variableMatches.map(match => match.replace(/\{\{|\}\}/g, ''));
    
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id 
        ? { ...editingTemplate, variables } 
        : t
    ));
    setEditingTemplate(null);
    toast.success('Template updated successfully');
  };

  const deleteTemplate = (id: number) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success('Template deleted successfully');
  };

  const duplicateTemplate = (template: Template) => {
    const newId = Math.max(0, ...templates.map(t => t.id)) + 1;
    setTemplates([
      ...templates,
      {
        ...template,
        id: newId,
        name: `${template.name} (Copy)`,
      }
    ]);
    toast.success('Template duplicated successfully');
  };

  const handleNewTemplateSubmit = () => {
    if (!newTemplate.name || !newTemplate.content) return;
    
    // Extract variables from content (text between {{ and }})
    const variableMatches = newTemplate.content.match(/\{\{([^}]+)\}\}/g) || [];
    const variables = variableMatches.map(match => match.replace(/\{\{|\}\}/g, ''));
    
    const newId = Math.max(0, ...templates.map(t => t.id)) + 1;
    setTemplates([
      ...templates,
      {
        ...newTemplate,
        id: newId,
        variables,
      }
    ]);
    
    toast.success('Template created successfully');
    
    setNewTemplate({
      name: '',
      content: '',
      variables: [],
    });
    setShowNewForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage tweet templates for automated posting</p>
        </div>
        <button 
          onClick={() => setShowNewForm(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150 self-start"
        >
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      {/* New Template Form */}
      {showNewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Template</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                placeholder="e.g., Financial Update"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Content</label>
              <textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                rows={4}
                placeholder="Write your template here. Use {{variable}} for dynamic values."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use {`{{placeholders}}`} for dynamic values that will be filled with scraped data.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
              >
                Cancel
              </button>
              <button 
                onClick={handleNewTemplateSubmit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150"
                disabled={!newTemplate.name || !newTemplate.content}
              >
                <Save size={16} />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500"
          >
            {editingTemplate?.id === template.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Content</label>
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={cancelEditing}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEditing}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => startEditing(template)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => duplicateTemplate(template)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTemplate(template.id)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="mt-3 text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
                  {template.content}
                </p>
                
                {template.variables.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dynamic Variables:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {template.variables.map((variable) => (
                        <span 
                          key={variable}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {templates.length === 0 && !showNewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No templates yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Create your first template to get started with automated posting.
          </p>
          <button 
            onClick={() => setShowNewForm(true)}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg inline-flex items-center space-x-2 transition-colors duration-150"
          >
            <Plus size={16} />
            <span>Create Template</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostTemplates;
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchTasks, proposeSwap, updateTask, completeTask, deleteTask } from '../services/api';
import ChatBox from '../components/ChatBox';
import UserCard from '../components/UserCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [creator, setCreator] = useState(null);
  const [similarTasks, setSimilarTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposal, setProposal] = useState({ offeredSkills: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for modal
  const proposalsPerPage = 3; // Limit to 3 proposals per page
  const socket = io('http://localhost:5000', {
    auth: { token: localStorage.getItem('token') },
  });

  const indexOfLastProposal = currentPage * proposalsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - proposalsPerPage;
  const currentProposals = task?.proposals?.slice(indexOfFirstProposal, indexOfLastProposal) || [];
  const totalPages = Math.ceil((task?.proposals?.length || 0) / proposalsPerPage);

  const handleProposeSwap = async (e) => {
    e.preventDefault();
    if (!user || !task) return;
    if (task.createdBy._id === user._id) {
      toast.error('Cannot propose a swap on your own task.');
      return;
    }
    try {
      const offeredSkillsArray = proposal.offeredSkills.split(',').map(skill => skill.trim());
      const response = await proposeSwap(id, { userId: user._id, offeredSkills: offeredSkillsArray, message: proposal.message });
      if (response.message === 'Swap proposed successfully') {
        toast.success('Swap proposed successfully!');
        setProposal({ offeredSkills: '', message: '' });
        setTask(response.task);
      }
    } catch (err) {
      toast.error('Failed to propose swap: ' + err.message);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    if (!user || user._id !== task.createdBy._id) return;
    try {
      socket.emit('updateProposal', { taskId: id, proposalId, status: 'accepted' });
      const updatedProposals = task.proposals.map(p =>
        p._id.toString() === proposalId ? { ...p, status: 'accepted' } : p
      );
      await updateTask(id, { proposals: updatedProposals, status: 'in-progress' });
      toast.success('Proposal accepted!');
      const updatedTasks = await fetchTasks({});
      const updatedTask = updatedTasks.find(t => t._id === id);
      setTask(updatedTask);
    } catch (err) {
      toast.error('Failed to accept proposal: ' + err.message);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    if (!user || user._id !== task.createdBy._id) return;
    try {
      socket.emit('updateProposal', { taskId: id, proposalId, status: 'rejected' });
      const updatedProposals = task.proposals.map(p =>
        p._id.toString() === proposalId ? { ...p, status: 'rejected' } : p
      );
      await updateTask(id, { proposals: updatedProposals });
      toast.success('Proposal rejected!');
      const updatedTasks = await fetchTasks({});
      const updatedTask = updatedTasks.find(t => t._id === id);
      setTask(updatedTask);
    } catch (err) {
      toast.error('Failed to reject proposal: ' + err.message);
    }
  };

  const handleCompleteTask = async () => {
    if (!user || user._id !== task.createdBy._id) return;
    try {
      await completeTask(id);
      toast.success('Task marked as completed!');
      const completedTasks = await fetchTasks({ status: 'completed' });
      const updatedTask = completedTasks.find(t => t._id === id);
      setTask(updatedTask);
    } catch (err) {
      toast.error('Failed to complete task: ' + err.message);
    }
  };

  const handleDeleteTask = async () => {
    if (!user || !task) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete task: ' + err.message);
      setError('Failed to delete task.');
    }
    setShowDeleteModal(false); // Close modal after action
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close modal without deleting
  };

  useEffect(() => {
    const loadTaskDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const tasks = await fetchTasks({});
        const foundTask = tasks.find(t => t._id === id);
        if (!foundTask) {
          navigate('/');
          return;
        }
        setTask(foundTask);
        if (foundTask.createdBy) {
          setCreator({
            _id: foundTask.createdBy._id,
            name: foundTask.createdBy.name || 'Unknown User',
            email: foundTask.createdBy.email || '',
            skills: foundTask.createdBy.skills || [],
            bio: foundTask.createdBy.bio || 'No bio available',
            location: foundTask.createdBy.location || 'Location not specified',
          });
        }
        const similar = tasks
          .filter(t =>
            t._id !== id &&
            (t.skillsNeeded.some(skill => foundTask.skillsNeeded.includes(skill)) ||
             t.offeredSkill === foundTask.offeredSkill)
          )
          .slice(0, 2);
        setSimilarTasks(similar);
      } catch (err) {
        console.error('Error fetching task details:', err);
        toast.error('Failed to load task details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadTaskDetails();

    return () => socket.disconnect();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-12">Loading task...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!task) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {task.image && (
              <img src={task.image} alt={task.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'open' ? 'bg-green-100 text-green-800' : 
                  task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{task.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills Needed</h2>
                  <div className="flex flex-wrap gap-2">
                    {task.skillsNeeded?.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Skill Offered</h2>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    {task.offeredSkill}
                  </span>
                </div>
              </div>
              {user && user._id !== task.createdBy._id && (
                <form onSubmit={handleProposeSwap} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-gray-700">Offered Skills</label>
                    <input
                      type="text"
                      value={proposal.offeredSkills}
                      onChange={(e) => setProposal({ ...proposal, offeredSkills: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="e.g., Graphic Design, Coding (comma-separated)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Message</label>
                    <textarea
                      value={proposal.message}
                      onChange={(e) => setProposal({ ...proposal, message: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="Add a message to the task creator"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Propose Skill Swap
                  </button>
                </form>
              )}
              {user && user._id === task.createdBy._id && (
                <div className="mt-6">
                  <button
                    onClick={handleCompleteTask}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 mb-4"
                    disabled={task.status === 'completed'}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 ml-4"
                  >
                    Delete Task
                  </button>
                  {task.proposals && task.proposals.length > 0 ? (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Proposals</h2>
                      <div className="overflow-y-auto" style={{ maxHeight: '30vh' }}>
                        {currentProposals.map(proposal => (
                          <div key={proposal._id} className="border border-gray-200 rounded-lg p-4 mb-4">
                            <p><strong>Offered Skills:</strong> {proposal.offeredSkills.join(', ')}</p>
                            <p><strong>Message:</strong> {proposal.message}</p>
                            <p><strong>Status:</strong> {proposal.status || 'pending'}</p>
                            {proposal.status === 'pending' && (
                              <div className="mt-2 space-x-2">
                                <button
                                  onClick={() => handleAcceptProposal(proposal._id.toString())}
                                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRejectProposal(proposal._id.toString())}
                                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {totalPages > 1 && (
                          <div className="flex justify-between mt-2">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No proposals yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion</h2>
              <ChatBox taskId={id} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {creator && <UserCard user={creator} title="Task Creator" />}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Tasks</h2>
            <div className="space-y-4">
              {similarTasks.length > 0 ? (
                similarTasks.map(task => (
                  <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Offering: {task.offeredSkill}</p>
                    <Link to={`/tasks/${task._id}`} className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                      View details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No similar tasks found</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
}